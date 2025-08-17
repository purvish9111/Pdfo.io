import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { RotatePDFGrid } from "@/components/RotatePDFGrid";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { rotatePDFPages, downloadBlob, generateRealPDFPages } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";

interface PDFPage {
  id: string;
  pageNumber: number;
  rotation: number;
}

export default function RotatePDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    // Generate real PDF pages from file
    const realPages = await generateRealPDFPages(selectedFile);
    const pagesWithRotation = realPages.map(page => ({
      ...page,
      rotation: 0,
    }));
    setPages(pagesWithRotation);
  };

  const handleRotate = async (updatedPages: PDFPage[]) => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(20);
      // Create rotation map for pages that have been rotated
      const rotations: Record<number, number> = {};
      updatedPages.forEach(page => {
        if (page.rotation !== 0) {
          rotations[page.pageNumber - 1] = page.rotation; // Convert to 0-indexed
        }
      });
      
      setProgress(70);
      const processedBlob = await rotatePDFPages(file, rotations);
      setProgress(90);
      downloadBlob(processedBlob, 'rotated-document.pdf');
      setProgress(100);
      toast({
        title: "Success!",
        description: "Your PDF pages have been rotated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rotate PDF pages. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Tools */}
        <div className="mb-8">
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center text-sm">
            ← Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="Rotate PDF pages tool">
            <i className="fas fa-redo-alt" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Rotate PDF</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Rotate individual pages or all pages in your PDF
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Fast Processing
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Secure & Private
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Free to Use
            </div>
          </div>
        </div>

        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
          />
        ) : (
          <>
            <RotatePDFGrid
              file={file}
              pages={pages}
              onRotate={handleRotate}
              isProcessing={isProcessing}
            />
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="orange"
              className="mt-6"
            />
            {!isProcessing && (
              <div className="text-center mt-6">
                <BuyMeCoffeeButton />
              </div>
            )}
          </>
        )}
      </div>

      <ToolFooter />
    </>
  );
}

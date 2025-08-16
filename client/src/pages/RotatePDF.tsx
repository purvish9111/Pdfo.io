import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { RotatePDFGrid } from "@/components/RotatePDFGrid";
import { ToolFooter } from "@/components/ToolFooter";
import { processPDFPages, downloadBlob } from "@/lib/pdfUtils";
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
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    // Generate mock pages (assume 5 pages for demo)
    const mockPages: PDFPage[] = Array.from({ length: 5 }, (_, index) => ({
      id: `page-${index + 1}-${Date.now()}`,
      pageNumber: index + 1,
      rotation: 0,
    }));
    setPages(mockPages);
  };

  const handleRotate = async (updatedPages: PDFPage[]) => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      // Convert PDFPage[] to the format expected by processPDFPages
      const pagesWithFlags = updatedPages.map(page => ({
        id: page.id,
        pageNumber: page.pageNumber,
        rotation: page.rotation,
        deleted: false,
      }));
      
      const processedBlob = await processPDFPages(file, pagesWithFlags);
      downloadBlob(processedBlob, 'rotated-document.pdf');
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
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            ↻
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
          <RotatePDFGrid
            file={file}
            pages={pages}
            onRotate={handleRotate}
            isProcessing={isProcessing}
          />
        )}
      </div>

      <ToolFooter />
    </>
  );
}

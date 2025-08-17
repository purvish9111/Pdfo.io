import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ReorderPDFGridNative } from "@/components/ReorderPDFGridNative";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { reorderPDFPages, downloadBlob, generateRealPDFPages } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";

interface PDFPage {
  id: string;
  pageNumber: number;
  originalIndex: number;
}

export default function ReorderPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    console.log('📄 ReorderPages - Files selected:', files.map(f => f.name));
    if (files.length === 0) return;
    
    const selectedFile = files[0];
    console.log('📄 ReorderPages - Selected file:', selectedFile.name, selectedFile.size);
    setFile(selectedFile);
    
    try {
      // Generate real PDF pages from file
      const realPages = await generateRealPDFPages(selectedFile);
      console.log('✅ ReorderPages real pages generated:', realPages.length);
      const pagesWithIndex = realPages.map((page, index) => ({
        ...page,
        originalIndex: index,
      }));
      console.log('✅ Pages with index created:', pagesWithIndex.length);
      setPages(pagesWithIndex);
    } catch (error) {
      console.error('Error generating PDF pages:', error);
      toast({
        title: "Error",
        description: "Failed to load PDF pages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReorder = async (reorderedPages: PDFPage[]) => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      // Extract the new page order (0-indexed for PDF processing)
      const newOrder = reorderedPages.map(page => page.originalIndex);
      
      setProgress(50);
      const processedBlob = await reorderPDFPages(file, newOrder);
      setProgress(90);
      
      downloadBlob(processedBlob, 'reordered-document.pdf');
      setProgress(100);
      
      toast({
        title: "Success!",
        description: "Your PDF pages have been reordered successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder PDF pages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
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
          <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="Reorder pages tool">
            <i className="fas fa-sort" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Reorder Pages</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Drag and drop pages to reorder your PDF
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
            <ReorderPDFGridNative
              file={file}
              pages={pages}
              onReorder={handleReorder}
              isProcessing={isProcessing}
            />
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="purple"
              className="mt-6"
            />
          </>
        )}
        
        {file && !isProcessing && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>💡 Tip:</strong> Drag and drop the page thumbnails to reorder them. The page numbers show the current position and original position.
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setPages([]);
                  setProgress(0);
                }}
                className="text-gray-600 dark:text-gray-300"
              >
                Start Over
              </Button>
            </div>
          </div>
        )}
      </div>

      <ToolFooter />
    </>
  );
}

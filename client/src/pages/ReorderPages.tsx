import { useState, useEffect } from "react";
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
  const [reorderedBlob, setReorderedBlob] = useState<Blob | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const handlePagesChange = (reorderedPages: PDFPage[]) => {
    setPages(reorderedPages);
    // Check if pages have been reordered from original
    const hasReordered = reorderedPages.some((page, index) => page.originalIndex !== index);
    setHasChanges(hasReordered);
  };

  const handleApplyReorder = async () => {
    if (!file || !hasChanges) return;
    
    console.log('🔄 Starting PDF reorder process...', pages.map(p => `Page ${p.pageNumber} (orig: ${p.originalIndex})`));
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(20);
      // Extract the new page order (0-indexed for PDF processing)
      const newOrder = pages.map(page => page.originalIndex);
      console.log('📋 New page order:', newOrder);
      
      setProgress(60);
      const processedBlob = await reorderPDFPages(file, newOrder);
      
      setProgress(90);
      setReorderedBlob(processedBlob);
      setProgress(100);
      
      toast({
        title: "Success!",
        description: "Your PDF has been reordered. Download button available below.",
      });
    } catch (error) {
      console.error('❌ Reorder error:', error);
      toast({
        title: "Error",
        description: "Failed to reorder PDF pages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (reorderedBlob) {
      downloadBlob(reorderedBlob, 'reordered-document.pdf');
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
              onPagesChange={handlePagesChange}
              isProcessing={isProcessing}
            />

            {/* Progress Bar */}
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="purple"
              className="mt-6"
            />

            {/* Page Order Changes Summary */}
            {hasChanges && !isProcessing && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                <h3 className="text-blue-800 dark:text-blue-200 font-medium mb-2">Page Order Changes</h3>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  The following pages have been reordered:
                  <div className="mt-2 space-y-1">
                    {pages.map((page, newIndex) => {
                      if (page.originalIndex !== newIndex) {
                        return (
                          <div key={page.id} className="text-blue-600 dark:text-blue-400">
                            Page {page.pageNumber}: Position {page.originalIndex + 1} → {newIndex + 1}
                          </div>
                        );
                      }
                      return null;
                    }).filter(Boolean)}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-6">
              {hasChanges && !reorderedBlob ? (
                <Button
                  onClick={handleApplyReorder}
                  disabled={isProcessing}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <i className="fas fa-check mr-2"></i>
                  Apply Page Order
                </Button>
              ) : null}

              {reorderedBlob && !isProcessing && (
                <Button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download Reordered PDF
                </Button>
              )}
            </div>
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
                  setReorderedBlob(null);
                  setHasChanges(false);
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

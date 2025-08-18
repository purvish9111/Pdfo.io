import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { DeletePDFGrid } from "@/components/DeletePDFGrid";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { deletePDFPages, downloadBlob, generateRealPDFPages } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";

interface PDFPage {
  id: string;
  pageNumber: number;
  deleted: boolean;
}

export default function DeletePages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    console.log('Delete - Files selected:', files);
    const selectedFile = files[0];
    console.log('Delete - Selected file:', selectedFile.name, selectedFile.size);
    setFile(selectedFile);
    setProcessedBlob(null);
    
    try {
      // Generate real PDF pages from file
      const realPages = await generateRealPDFPages(selectedFile);
      console.log('Delete - Generated pages:', realPages);
      const pagesWithDeleteFlag = realPages.map(page => ({
        ...page,
        deleted: false,
      }));
      console.log('Delete - Pages with delete flag:', pagesWithDeleteFlag);
      setPages(pagesWithDeleteFlag);
    } catch (error) {
      console.error('Delete - Error generating PDF pages:', error);
      toast({
        title: "Error",
        description: "Failed to load PDF pages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!processedBlob) return;
    downloadBlob(processedBlob, 'pages-deleted-document.pdf');
  };

  const handleDelete = async (updatedPages: PDFPage[]) => {
    if (!file) return;
    
    const remainingPages = updatedPages.filter(p => !p.deleted);
    if (remainingPages.length === 0) {
      toast({
        title: "Error",
        description: "Cannot create PDF with no pages. Please keep at least one page.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(20);
      // Get the page indices to keep (0-indexed for PDF processing)
      const pagesToKeep = updatedPages
        .filter(page => !page.deleted)
        .map(page => page.pageNumber - 1);
      
      setProgress(50);
      const deletedBlob = await deletePDFPages(file, pagesToKeep);
      setProgress(90);
      setProcessedBlob(deletedBlob);
      setProgress(100);
      
      toast({
        title: "Success!",
        description: `PDF created with ${remainingPages.length} pages. Deleted pages removed successfully. Download button available below.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete PDF pages. Please try again.",
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
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="Delete pages tool">
            <i className="fas fa-trash-alt" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Delete Pages</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Remove unwanted pages from your PDF
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
            <DeletePDFGrid
              file={file}
              pages={pages}
              onDelete={handleDelete}
              isProcessing={isProcessing}
            />
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="red"
              className="mt-6"
            />
            
            {file && !isProcessing && (
              <div className="mt-4 flex justify-center">
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
            )}
          </>
        )}
      </div>

      <ToolFooter />
    </>
  );
}

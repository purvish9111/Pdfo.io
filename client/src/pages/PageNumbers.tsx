import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { PageNumbersGrid } from "@/components/PageNumbersGrid";
import { ToolFooter } from "@/components/ToolFooter";
import { addPageNumbers, downloadBlob } from "@/lib/pdfUtils";
import { useToast } from "@/hooks/use-toast";

interface PDFPage {
  id: string;
  pageNumber: number;
}

interface PageNumberSettings {
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  format: string;
  fontFamily: string;
  fontSize: number;
  color: string;
}

export default function PageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    // Generate mock pages (assume 6 pages for demo)
    const mockPages: PDFPage[] = Array.from({ length: 6 }, (_, index) => ({
      id: `page-${index + 1}-${Date.now()}`,
      pageNumber: index + 1,
    }));
    setPages(mockPages);
  };

  const handleAddPageNumbers = async (settings: PageNumberSettings) => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      // Convert settings to legacy format for compatibility
      const options = {
        position: settings.position.includes('top') ? 'top' as const : 'bottom' as const,
        alignment: settings.position.includes('center') ? 'center' as const : 
                  settings.position.includes('left') ? 'left' as const : 'right' as const,
        startNumber: 1,
      };
      
      const numberedBlob = await addPageNumbers(file, options);
      downloadBlob(numberedBlob, 'numbered-document.pdf');
      toast({
        title: "Success!",
        description: "Page numbers have been added to your PDF successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add page numbers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Tools */}
        <div className="mb-8">
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center text-sm">
            ← Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            #
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page Numbers</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Add customizable page numbers to your PDF documents
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
          <PageNumbersGrid
            file={file}
            pages={pages}
            onAddPageNumbers={handleAddPageNumbers}
            isProcessing={isProcessing}
          />
        )}
      </div>

      <ToolFooter />
    </>
  );
}
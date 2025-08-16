import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { PDFPreview } from "@/components/PDFPreview";
import { ToolFooter } from "@/components/ToolFooter";
import { processPDFPages, downloadBlob, generatePages } from "@/lib/pdfUtils";
import { useToast } from "@/hooks/use-toast";

interface PDFPage {
  id: string;
  pageNumber: number;
  rotation: number;
  deleted: boolean;
}

export default function ReorderPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    // Generate mock pages (assume 6 pages for demo)
    setPages(generatePages(6));
  };

  const handleDownload = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const processedBlob = await processPDFPages(file, pages);
      downloadBlob(processedBlob, 'reordered-document.pdf');
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
    }
  };

  const handleNewUpload = () => {
    setFile(null);
    setPages([]);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Tools */}
        <div className="mb-8">
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center text-sm">
            ← Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-violet-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            ↕
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Reorder Pages</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Drag and drop to rearrange pages in your PDF document to achieve the perfect order. Our intuitive interface makes page organization quick and easy.
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
          <PDFPreview
            file={file}
            pages={pages}
            onPagesChange={setPages}
            onDownload={handleDownload}
            onNewUpload={handleNewUpload}
            toolType="reorder"
          />
        )}
        
        {file && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>💡 Tip:</strong> Drag and drop the page thumbnails to reorder them. Click the rotate button to adjust page orientation, or the delete button to remove unwanted pages.
            </p>
          </div>
        )}
      </div>

      <ToolFooter />
    </>
  );
}

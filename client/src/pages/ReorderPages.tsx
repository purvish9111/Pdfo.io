import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { PDFPreview } from "@/components/PDFPreview";
import { MainFooter } from "@/components/MainFooter";
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Reorder PDF Pages</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Drag and drop to rearrange pages in your PDF document to achieve the perfect order.
          </p>
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
      <MainFooter />
    </>
  );
}

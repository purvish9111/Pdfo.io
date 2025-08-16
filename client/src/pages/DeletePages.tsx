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

export default function DeletePages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    // Generate mock pages (assume 7 pages for demo)
    setPages(generatePages(7));
  };

  const handleDownload = async () => {
    if (!file) return;
    
    const remainingPages = pages.filter(p => !p.deleted);
    if (remainingPages.length === 0) {
      toast({
        title: "Error",
        description: "Cannot create PDF with no pages. Please keep at least one page.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      const processedBlob = await processPDFPages(file, pages);
      downloadBlob(processedBlob, 'pages-deleted-document.pdf');
      toast({
        title: "Success!",
        description: `PDF created with ${remainingPages.length} pages. Deleted pages removed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete PDF pages. Please try again.",
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

  const deletedCount = pages.filter(p => p.deleted).length;
  const remainingCount = pages.filter(p => !p.deleted).length;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Delete PDF Pages</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Remove unwanted pages from your PDF with a simple click. Clean up your documents effortlessly.
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
            toolType="delete"
          />
        )}
        
        {file && pages.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>📊 Status:</strong> {remainingCount} pages will be kept, {deletedCount} pages will be deleted.
              {remainingCount === 0 && " ⚠️ Warning: You must keep at least one page."}
            </p>
          </div>
        )}
      </div>

      <ToolFooter />
      <MainFooter />
    </>
  );
}

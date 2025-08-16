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

export default function RotatePDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    // Generate mock pages (assume 5 pages for demo)
    setPages(generatePages(5));
  };

  const handleDownload = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const processedBlob = await processPDFPages(file, pages);
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

  const handleNewUpload = () => {
    setFile(null);
    setPages([]);
  };

  const rotatedPages = pages.filter(p => p.rotation !== 0);

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Rotate PDF Pages</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Rotate pages 90, 180, or 270 degrees to correct orientation and improve readability.
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
            toolType="rotate"
          />
        )}
        
        {file && pages.length > 0 && (
          <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-sm text-orange-700 dark:text-orange-300">
              <strong>🔄 Rotation Status:</strong> {rotatedPages.length > 0 
                ? `${rotatedPages.length} pages will be rotated. Click on page thumbnails to rotate them.`
                : "No pages rotated yet. Hover over pages and click the rotate button to adjust orientation."
              }
            </p>
          </div>
        )}
      </div>

      <ToolFooter />
      <MainFooter />
    </>
  );
}

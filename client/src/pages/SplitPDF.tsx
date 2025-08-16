import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { PDFPreview } from "@/components/PDFPreview";
import { MainFooter } from "@/components/MainFooter";
import { ToolFooter } from "@/components/ToolFooter";
import { splitPDF, downloadBlob, generatePages } from "@/lib/pdfUtils";
import { useToast } from "@/hooks/use-toast";

interface PDFPage {
  id: string;
  pageNumber: number;
  rotation: number;
  deleted: boolean;
}

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    // Generate mock pages (assume 8 pages for demo)
    setPages(generatePages(8));
  };

  const handleDownload = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      // For split, we'll create individual page downloads
      const visiblePages = pages.filter(p => !p.deleted);
      const pageRanges = visiblePages.map(p => [p.pageNumber, p.pageNumber]);
      
      const splitBlobs = await splitPDF(file, pageRanges);
      
      // Download each split as separate file
      splitBlobs.forEach((blob, index) => {
        downloadBlob(blob, `split-page-${visiblePages[index].pageNumber}.pdf`);
      });
      
      toast({
        title: "Success!",
        description: `PDF split into ${splitBlobs.length} separate files.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to split PDF file. Please try again.",
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Split PDF Files</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Extract specific pages or split your PDF into multiple separate files with precision control.
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
            toolType="split"
          />
        )}
      </div>

      <ToolFooter />
      <MainFooter />
    </>
  );
}

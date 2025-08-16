import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { PDFPreview } from "@/components/PDFPreview";
import { MainFooter } from "@/components/MainFooter";
import { ToolFooter } from "@/components/ToolFooter";
import { mergePDFs, downloadBlob, generatePages } from "@/lib/pdfUtils";
import { useToast } from "@/hooks/use-toast";

interface PDFPage {
  id: string;
  pageNumber: number;
  rotation: number;
  deleted: boolean;
}

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(newFiles);
    // Generate mock pages for all files
    let pageCounter = 1;
    const allPages: PDFPage[] = [];
    
    newFiles.forEach((file, fileIndex) => {
      // Mock: assume each PDF has 3-5 pages
      const pageCount = 3 + (fileIndex % 3);
      const filePages = generatePages(pageCount).map(page => ({
        ...page,
        id: `file-${fileIndex}-page-${page.pageNumber}`,
        pageNumber: pageCounter++,
      }));
      allPages.push(...filePages);
    });
    
    setPages(allPages);
  };

  const handleDownload = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    try {
      const mergedBlob = await mergePDFs(files);
      downloadBlob(mergedBlob, 'merged-document.pdf');
      toast({
        title: "Success!",
        description: "Your PDF files have been merged successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to merge PDF files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewUpload = () => {
    setFiles([]);
    setPages([]);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Merge PDF Files</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Combine multiple PDF files into a single document. Simply upload your files and arrange them in the desired order.
          </p>
        </div>

        {files.length === 0 ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={true}
          />
        ) : (
          <PDFPreview
            file={files[0]} // Primary file for display
            pages={pages}
            onPagesChange={setPages}
            onDownload={handleDownload}
            onNewUpload={handleNewUpload}
            toolType="merge"
          />
        )}

        {files.length > 1 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>{files.length} files selected:</strong> {files.map(f => f.name).join(', ')}
            </p>
          </div>
        )}
      </div>

      <ToolFooter />
      <MainFooter />
    </>
  );
}

import { useState } from "react";
import { Link } from "wouter";
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Tools */}
        <div className="mb-8">
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center text-sm">
            ← Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            ⊞
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Merge PDF</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Merge multiple PDF files into a single document with our free online PDF merger. Simply upload your PDF files, arrange them in the desired order, and download your combined PDF instantly. Our secure tool processes files locally without uploading to servers.
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

        {files.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📁</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upload PDF Files</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Select multiple PDF files to process them</p>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 mb-6">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <span className="text-4xl">📁</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">Drop your PDF files here</p>
                  <p className="text-gray-400 text-sm">or</p>
                </div>
              </div>
              
              <FileUpload
                onFilesSelected={handleFilesSelected}
                acceptMultiple={true}
              />
              
              <p className="text-xs text-gray-400 mt-4">
                Maximum file size: 15MB per file<br/>
                Files are automatically deleted within 1 hour for your privacy
              </p>
            </div>
          </div>
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

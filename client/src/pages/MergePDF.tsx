import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { FilesPreviewWithThumbnails } from "@/components/FilesPreviewWithThumbnails";
import { Button } from "@/components/ui/button";
import { ToolFooter } from "@/components/ToolFooter";
import { mergePDFs, downloadBlob } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const handleFilesReorder = (reorderedFiles: File[]) => {
    setFiles(reorderedFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    
    setIsProcessing(true);
    try {
      const mergedBlob = await mergePDFs(files);
      downloadBlob(mergedBlob, 'merged-document.pdf');
      toast({
        title: "Success!",
        description: `Your ${files.length} PDF files have been merged successfully.`,
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
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4">
            <i className="fas fa-layer-group"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Merge PDF</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Combine multiple PDF files into one document
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
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={true}
          />
        ) : (
          <FilesPreviewWithThumbnails
            files={files}
            onFilesChange={setFiles}
            title="PDFs to Merge"
          >
            <Button
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Merging...
                </>
              ) : (
                `Merge ${files.length} PDF${files.length !== 1 ? 's' : ''}`
              )}
            </Button>
          </FilesPreviewWithThumbnails>
        )}
      </div>

      <ToolFooter />
    </>
  );
}

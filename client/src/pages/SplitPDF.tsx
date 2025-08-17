import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { FilesPreviewWithThumbnails } from "@/components/FilesPreviewWithThumbnails";
import { SplitPDFGrid } from "@/components/SplitPDFGrid";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { splitPDF, downloadBlob, generateRealPDFPages } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";

interface PDFPage {
  id: string;
  pageNumber: number;
}

interface SplitPoint {
  id: string;
  afterPage: number;
}

export default function SplitPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFilesSelected = async (selectedFiles: File[]) => {
    // Allow multiple PDF files for batch splitting
    setFiles(prev => [...prev, ...selectedFiles]);
    if (selectedFiles.length > 0 && !selectedFile) {
      const firstFile = selectedFiles[0];
      setSelectedFile(firstFile);
      const realPages = await generateRealPDFPages(firstFile);
      setPages(realPages);
    }
  };

  const handleFilesReorder = (reorderedFiles: File[]) => {
    setFiles(reorderedFiles);
  };

  const handleSplit = async (splitPoints: SplitPoint[]) => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(10);
      // Create page groups based on split points
      const groups: PDFPage[][] = [];
      let currentGroup: PDFPage[] = [];
      
      for (const page of pages) {
        currentGroup.push(page);
        
        // Check if there's a split point after this page
        const hasSplit = splitPoints.some(sp => sp.afterPage === page.pageNumber);
        if (hasSplit) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      }
      
      // Add the last group if it has pages
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }

      // Create page ranges for each group
      const pageRanges = groups.map(group => [
        group[0].pageNumber,
        group[group.length - 1].pageNumber
      ]);
      
      setProgress(50);
      const splitBlobs = await splitPDF(selectedFile, pageRanges);
      setProgress(90);
      
      // Download each split as separate file
      splitBlobs.forEach((blob, index) => {
        const group = groups[index];
        const startPage = group[0].pageNumber;
        const endPage = group[group.length - 1].pageNumber;
        const fileName = startPage === endPage 
          ? `split-page-${startPage}.pdf`
          : `split-pages-${startPage}-${endPage}.pdf`;
        downloadBlob(blob, fileName);
      });

      setProgress(100);
      
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
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4">
            <i className="fas fa-cut"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Split PDF</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Split your PDF into separate documents
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
          <>
            <FilesPreviewWithThumbnails
              files={files}
              onFilesChange={(updatedFiles: File[]) => setFiles(updatedFiles)}
            />
            {selectedFile && pages.length > 0 && (
              <SplitPDFGrid
                file={selectedFile}
                pages={pages}
                onSplit={handleSplit}
                isProcessing={isProcessing}
              />
            )}
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="green"
              className="mt-6"
            />
            {!isProcessing && (
              <div className="text-center mt-6">
                <BuyMeCoffeeButton />
              </div>
            )}
          </>
        )}
      </div>

      <ToolFooter />
    </>
  );
}

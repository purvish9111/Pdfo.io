import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { SplitPDFGrid } from "@/components/SplitPDFGrid";
import { ToolFooter } from "@/components/ToolFooter";
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
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    // Generate real PDF pages from file
    const realPages = await generateRealPDFPages(selectedFile);
    setPages(realPages);
  };

  const handleSplit = async (splitPoints: SplitPoint[]) => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
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
      
      const splitBlobs = await splitPDF(file, pageRanges);
      
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

        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
          />
        ) : (
          <SplitPDFGrid
            file={file}
            pages={pages}
            onSplit={handleSplit}
            isProcessing={isProcessing}
          />
        )}
      </div>

      <ToolFooter />
    </>
  );
}

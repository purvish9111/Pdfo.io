import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { FilesPreviewWithThumbnails } from "@/components/FilesPreviewWithThumbnails";
import { SplitPDFGrid } from "@/components/SplitPDFGrid";
import { ToolFooter } from "@/components/ToolFooter";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { splitPDF, downloadBlob, generateRealPDFPages } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";
import { toolSEOData } from "@/lib/seo-data";

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
  const [splitFiles, setSplitFiles] = useState<Blob[]>([]);
  const { toast } = useToast();

  const seoData = toolSEOData['/split'];

  const handleFilesSelected = async (selectedFiles: File[]) => {
    // Allow multiple PDF files for batch splitting
    setFiles(prev => [...prev, ...selectedFiles]);
    if (selectedFiles.length > 0 && !selectedFile) {
      const firstFile = selectedFiles[0];
      setSelectedFile(firstFile);
      const realPages = await generateRealPDFPages(firstFile);
      console.log('✅ SplitPDF real pages generated:', realPages.length);
      setPages(realPages);
    }
  };

  const handleFilesReorder = (reorderedFiles: File[]) => {
    setFiles(reorderedFiles);
  };

  const [currentSplitPoints, setCurrentSplitPoints] = useState<SplitPoint[]>([]);

  const handleSplit = async (splitPoints: SplitPoint[]) => {
    if (!selectedFile) return;
    
    setCurrentSplitPoints(splitPoints); // Store split points for download button logic
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
      
      // Store split files for download
      setSplitFiles(splitBlobs);

      setProgress(100);
      
      toast({
        title: "Success!",
        description: `PDF split into ${splitBlobs.length} separate files. Download buttons available below.`,
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
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={`${window.location.origin}/split`}
        structuredData={seoData.structuredData}
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Tools */}
        <div className="mb-8">
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center text-sm">
            ← Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="Split PDF tool">
            <i className="fas fa-cut" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{seoData.h1}</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            {seoData.content}
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
            acceptMultiple={false}
          />
        ) : (
          <>
            {/* File Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white">
                    <i className="fas fa-file-pdf text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{selectedFile?.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB • {pages.length} pages
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFiles([]);
                    setSelectedFile(null);
                    setPages([]);
                    setSplitFiles([]);
                    setCurrentSplitPoints([]);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <i className="fas fa-times mr-2"></i>
                  Remove
                </Button>
              </div>
            </div>

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
            
            {/* Download Split Files */}
            {splitFiles.length > 0 && !isProcessing && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Download Split Files ({splitFiles.length})
                </h3>
                <div className="grid gap-3">
                  {splitFiles.map((blob, index) => {
                    // Recreate groups using stored split points
                    const groups: PDFPage[][] = [];
                    let currentGroup: PDFPage[] = [];
                    
                    for (const page of pages) {
                      currentGroup.push(page);
                      
                      // Check if there's a split point after this page
                      const hasSplit = currentSplitPoints.some(sp => sp.afterPage === page.pageNumber);
                      if (hasSplit) {
                        groups.push(currentGroup);
                        currentGroup = [];
                      }
                    }
                    
                    // Add the last group if it has pages
                    if (currentGroup.length > 0) {
                      groups.push(currentGroup);
                    }
                    
                    const group = groups[index];
                    if (!group) return null;
                    
                    const startPage = group[0].pageNumber;
                    const endPage = group[group.length - 1].pageNumber;
                    const fileName = startPage === endPage 
                      ? `split-page-${startPage}.pdf`
                      : `split-pages-${startPage}-${endPage}.pdf`;
                    
                    return (
                      <Button
                        key={index}
                        onClick={() => downloadBlob(blob, fileName)}
                        variant="outline"
                        className="justify-start"
                      >
                        <i className="fas fa-download mr-2"></i>
                        {fileName}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
            
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

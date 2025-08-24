import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { PageNumbersGrid } from "@/components/PageNumbersGrid";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { addPageNumbers, downloadBlob, generateRealPDFPages } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";

interface PDFPage {
  id: string;
  pageNumber: number;
}

interface PageNumberSettings {
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  format: string;
  fontFamily: string;
  fontSize: number;
  color: string;
}

export default function PageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [numberedBlob, setNumberedBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = async (files: File[]) => {
    console.log('PageNumbers - Files selected:', files);
    const selectedFile = files[0];
    console.log('PageNumbers - Selected file:', selectedFile.name, selectedFile.size);
    setFile(selectedFile);
    setNumberedBlob(null);
    
    try {
      // Generate real PDF pages from file
      const realPages = await generateRealPDFPages(selectedFile);
      console.log('PageNumbers - Generated pages:', realPages);
      setPages(realPages);
    } catch (error) {
      console.error('PageNumbers - Error generating PDF pages:', error);
      toast({
        title: "Error",
        description: "Failed to load PDF pages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!numberedBlob) return;
    downloadBlob(numberedBlob, 'PDFo_PageNumbers.pdf');
  };

  const handleAddPageNumbers = async (settings: PageNumberSettings) => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(30);
      setProgress(70);
      const numberedBlob = await addPageNumbers(file, settings);
      setProgress(100);
      setNumberedBlob(numberedBlob);
      toast({
        title: "Success!",
        description: "Page numbers have been added to your PDF successfully. Download button available below.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add page numbers. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Tools */}
        <div className="mb-8">
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center text-sm">
            ← Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="Add page numbers tool">
            <i className="fas fa-list-ol" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page Numbers</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Add customizable page numbers to your PDF documents
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
          <>
            <PageNumbersGrid
              file={file}
              pages={pages}
              onAddPageNumbers={handleAddPageNumbers}
              isProcessing={isProcessing}
            />
            {/* Download Button */}
            {numberedBlob && !isProcessing && (
              <div className="text-center space-y-4 mt-6">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-8 py-4 text-lg font-medium bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  data-testid="button-download-numbered"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download Numbered PDF
                </button>
              </div>
            )}
            
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="purple"
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
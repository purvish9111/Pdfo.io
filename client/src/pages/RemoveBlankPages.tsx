import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SinglePDFThumbnail } from "@/components/SinglePDFThumbnail";
import { generatePDFThumbnail } from "@/lib/pdfThumbnails";
import { removeBlankPages, downloadBlob, detectBlankPages } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface PageInfo {
  pageNumber: number;
  isBlank: boolean;
  isSelected: boolean;
}

export default function RemoveBlankPages() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [blankPagesDetected, setBlankPagesDetected] = useState(0);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    setFile(files[0]);
    setPages([]);
    setBlankPagesDetected(0);
    setProcessedBlob(null);
    loadPDFAndDetectBlankPages(files[0]);
  };

  const handleDownload = () => {
    if (!processedBlob) return;
    downloadBlob(processedBlob, 'no-blank-pages.pdf');
  };

  const loadPDFAndDetectBlankPages = async (pdfFile: File) => {
    try {
      const thumbnail = await generatePDFThumbnail(pdfFile);
      
      // Real blank page detection using PDF.js
      const blankPages = await detectBlankPages(pdfFile);
      
      const pageInfos: PageInfo[] = Array.from({ length: thumbnail.pageCount }, (_, index) => ({
        pageNumber: index + 1,
        isBlank: blankPages.includes(index + 1),
        isSelected: blankPages.includes(index + 1) // Auto-select blank pages
      }));
      
      setPages(pageInfos);
      setBlankPagesDetected(blankPages.length);
    } catch (error) {
      console.error('Error detecting blank pages:', error);
      toast({
        title: "Error",
        description: "Failed to analyze PDF pages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const togglePageSelection = (pageNumber: number) => {
    setPages(prev => prev.map(page => 
      page.pageNumber === pageNumber 
        ? { ...page, isSelected: !page.isSelected }
        : page
    ));
  };

  const getSelectedBlankPages = () => {
    return pages.filter(page => page.isBlank && page.isSelected);
  };

  const handleRemoveBlankPages = async () => {
    if (!file) return;
    
    const selectedBlankPages = getSelectedBlankPages();
    if (selectedBlankPages.length === 0) {
      toast({
        title: "No pages selected",
        description: "Please select at least one blank page to remove.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      const cleanedBlob = await removeBlankPages(file);
      setProgress(100);
      setProcessedBlob(cleanedBlob);
      
      const removedCount = selectedBlankPages.length;
      const remainingPages = pages.length - removedCount;
      
      toast({
        title: "Success!",
        description: `${removedCount} blank page${removedCount > 1 ? 's' : ''} removed. Final document has ${remainingPages} pages. Download button available below.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove blank pages. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
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
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="Remove blank pages tool">
            <i className="fas fa-eraser" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Remove Blank Pages</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Automatically detect and remove empty pages from your PDF
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Auto Detection
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Clean Output
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
          <div className="space-y-6">
            {/* File Info and Blank Page Counter */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <i className="fas fa-file-pdf text-red-500 mr-2"></i>
                    <span>{file.name}</span>
                    <span className="ml-2">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-sm">
                    {pages.length} total pages
                  </Badge>
                  {blankPagesDetected > 0 && (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Blank pages detected: {blankPagesDetected}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* PDF Preview Grid with Blank Page Detection */}
            {pages.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  PDF Pages - Select blank pages to remove
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                  {pages.map((page) => (
                    <div key={page.pageNumber} className="relative">
                      <div className={`relative ${page.isBlank ? 'ring-2 ring-red-500' : ''}`}>
                        <SinglePDFThumbnail 
                          file={file} 
                          pageNumber={page.pageNumber}
                          className="w-full aspect-[3/4] rounded border border-gray-200 dark:border-gray-600"
                        />
                        
                        {/* Blank page overlay */}
                        {page.isBlank && (
                          <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded flex items-center justify-center">
                            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                              BLANK
                            </div>
                          </div>
                        )}
                        
                        {/* Page number */}
                        <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white text-xs text-center py-1 rounded-b">
                          Page {page.pageNumber}
                        </div>
                        
                        {/* Checkbox for blank pages */}
                        {page.isBlank && (
                          <div className="absolute top-2 left-2">
                            <Checkbox
                              checked={page.isSelected}
                              onCheckedChange={() => togglePageSelection(page.pageNumber)}
                              className="bg-white border-2 border-red-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {blankPagesDetected > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <i className="fas fa-exclamation-triangle text-yellow-500 mt-0.5 mr-3"></i>
                      <div>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                          {blankPagesDetected} blank page{blankPagesDetected > 1 ? 's' : ''} detected
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">
                          Blank pages are automatically selected for removal. Uncheck any page you want to keep.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {getSelectedBlankPages().length} blank page{getSelectedBlankPages().length !== 1 ? 's' : ''} selected for removal
                  </div>
                  
                  <Button
                    onClick={handleRemoveBlankPages}
                    disabled={isProcessing || getSelectedBlankPages().length === 0}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isProcessing ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Removing Pages...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove {getSelectedBlankPages().length} Blank Page{getSelectedBlankPages().length !== 1 ? 's' : ''}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="red"
            />

            {/* Reset Button */}
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFile(null);
                  setPages([]);
                  setBlankPagesDetected(0);
                }}
                disabled={isProcessing}
              >
                Choose Different File
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <ToolFooter />
      <BuyMeCoffeeButton />
    </>
  );
}
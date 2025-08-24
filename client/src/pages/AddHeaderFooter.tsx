import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { SinglePDFThumbnail } from "@/components/SinglePDFThumbnail";
import { generatePDFThumbnail } from "@/lib/pdfThumbnails";
import { addHeadersFooters, downloadBlob } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import { Type, AlignCenter, Palette } from "lucide-react";

export default function AddHeaderFooter() {
  const [file, setFile] = useState<File | null>(null);
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [headerPosition, setHeaderPosition] = useState('center');
  const [footerPosition, setFooterPosition] = useState('center');
  const [fontSize, setFontSize] = useState('12');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [pageRange, setPageRange] = useState('all');
  const [customRange, setCustomRange] = useState('');
  const [pdfPages, setPdfPages] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    setFile(files[0]);
    setPdfPages(0);
    setProcessedBlob(null);
    loadPDFInfo(files[0]);
  };

  const handleDownload = () => {
    if (!processedBlob) return;
    downloadBlob(processedBlob, 'header-footer-added.pdf');
  };

  const loadPDFInfo = async (pdfFile: File) => {
    try {
      const thumbnail = await generatePDFThumbnail(pdfFile);
      setPdfPages(thumbnail.pageCount);
    } catch (error) {
      console.error('Failed to load PDF info:', error);
    }
  };

  const handleAddHeaderFooter = async () => {
    if (!file || (!headerText && !footerText)) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      const modifiedBlob = await addHeadersFooters(file, headerText, footerText);
      setProgress(100);
      setProcessedBlob(modifiedBlob);
      
      // Track usage for dashboard - Fixed: Added missing tracking
      await trackToolUsage("Add Header & Footer", "manipulation", 1);
      
      toast({
        title: "Success!",
        description: "Header and footer have been added to your PDF. Download button available below.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add header/footer. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const getEffectivePageRange = () => {
    if (pageRange === 'all') return `1-${pdfPages}`;
    if (pageRange === 'custom' && customRange) return customRange;
    return `1-${pdfPages}`;
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
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="Add header and footer tool">
            <i className="fas fa-align-center" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Add Header & Footer</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Add custom headers and footers to all pages of your PDF
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Custom Text
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              All Pages
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Professional Look
            </div>
          </div>
        </div>

        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Panel - Left Side */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Type className="h-5 w-5 mr-2 text-blue-500" />
                    Text Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="header" className="text-sm font-medium">Header Text</Label>
                      <Input
                        id="header"
                        placeholder="Company Name - Document Title"
                        value={headerText}
                        onChange={(e) => setHeaderText(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="footer" className="text-sm font-medium">Footer Text</Label>
                      <Input
                        id="footer"
                        placeholder="Confidential - Page {n}"
                        value={footerText}
                        onChange={(e) => setFooterText(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <AlignCenter className="h-5 w-5 mr-2 text-blue-500" />
                    Position & Style
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Header Position</Label>
                        <Select value={headerPosition} onValueChange={setHeaderPosition}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Footer Position</Label>
                        <Select value={footerPosition} onValueChange={setFooterPosition}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Font Family</Label>
                        <Select value={fontFamily} onValueChange={setFontFamily}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Times">Times</SelectItem>
                            <SelectItem value="Courier">Courier</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Font Size</Label>
                        <Select value={fontSize} onValueChange={setFontSize}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8">8pt</SelectItem>
                            <SelectItem value="10">10pt</SelectItem>
                            <SelectItem value="12">12pt</SelectItem>
                            <SelectItem value="14">14pt</SelectItem>
                            <SelectItem value="16">16pt</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium flex items-center">
                        <Palette className="h-4 w-4 mr-1" />
                        Text Color
                      </Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                        />
                        <span className="text-sm text-gray-500">{textColor}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Page Range
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="all"
                        name="pageRange"
                        checked={pageRange === 'all'}
                        onChange={() => setPageRange('all')}
                        className="text-blue-500"
                      />
                      <Label htmlFor="all" className="text-sm">All pages (1-{pdfPages})</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="custom"
                        name="pageRange"
                        checked={pageRange === 'custom'}
                        onChange={() => setPageRange('custom')}
                        className="text-blue-500"
                      />
                      <Label htmlFor="custom" className="text-sm">Custom range</Label>
                    </div>
                    
                    {pageRange === 'custom' && (
                      <Input
                        placeholder="e.g., 1-5, 8, 10-12"
                        value={customRange}
                        onChange={(e) => setCustomRange(e.target.value)}
                        className="ml-6"
                      />
                    )}
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                    <strong>Apply to:</strong> {getEffectivePageRange()}
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleAddHeaderFooter}
                disabled={isProcessing || (!headerText && !footerText)}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Adding Header & Footer...
                  </>
                ) : (
                  <>
                    <i className="fas fa-align-center mr-2"></i>
                    Add Header & Footer
                  </>
                )}
              </Button>
            </div>

            {/* Live Preview - Right Side */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Live Preview
                  </h3>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: Math.min(pdfPages, 6) }, (_, index) => (
                        <div key={index} className="relative">
                          <div className="relative bg-white rounded border shadow-sm">
                            {/* Header Preview */}
                            {headerText && (
                              <div 
                                className={`absolute top-2 left-2 right-2 text-xs overflow-hidden text-${headerPosition}`}
                                style={{ 
                                  fontFamily: fontFamily, 
                                  fontSize: `${parseInt(fontSize) / 2}px`,
                                  color: textColor 
                                }}
                              >
                                {headerText}
                              </div>
                            )}
                            
                            {/* PDF Page */}
                            <SinglePDFThumbnail 
                              file={file} 
                              pageNumber={index + 1}
                              className="w-full aspect-[3/4] rounded"
                            />
                            
                            {/* Footer Preview */}
                            {footerText && (
                              <div 
                                className={`absolute bottom-2 left-2 right-2 text-xs overflow-hidden text-${footerPosition}`}
                                style={{ 
                                  fontFamily: fontFamily, 
                                  fontSize: `${parseInt(fontSize) / 2}px`,
                                  color: textColor 
                                }}
                              >
                                {footerText.replace('{n}', (index + 1).toString())}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-center mt-1 text-gray-500">
                            Page {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {pdfPages > 6 && (
                      <div className="text-center mt-4 text-sm text-gray-500">
                        ... and {pdfPages - 6} more pages
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Download Button - Fixed: Added missing download button */}
          {processedBlob && !isProcessing && (
            <div className="text-center space-y-4 mt-6">
              <Button
                onClick={handleDownload}
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-8"
              >
                <i className="fas fa-download mr-2"></i>
                Download PDF with Header & Footer
              </Button>
              <BuyMeCoffeeButton />
            </div>
          )}
        )}
      </div>
      
      <ToolFooter />
    </>
  );
}
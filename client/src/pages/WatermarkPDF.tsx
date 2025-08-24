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
import { Slider } from "@/components/ui/slider";
import { addWatermarkToPDF, downloadBlob, generateRealPDFPages, type WatermarkSettings } from "@/lib/realPdfUtils";
import { SinglePDFThumbnail } from "@/components/SinglePDFThumbnail";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";

interface PDFPage {
  id: string;
  pageNumber: number;
}

export default function WatermarkPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [settings, setSettings] = useState<WatermarkSettings>({
    type: 'text',
    text: 'CONFIDENTIAL',
    opacity: 0.3,
    rotation: 45,
    fontSize: 36,
    color: '#ff0000',
    position: 'center',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = async (files: File[]) => {
    const selectedFile = files[0];
    console.log('Watermark - Selected file:', selectedFile.name, selectedFile.size);
    setFile(selectedFile);
    setConvertedFile(null);
    
    try {
      // Generate real PDF pages from file
      const realPages = await generateRealPDFPages(selectedFile);
      console.log('Watermark - Generated pages:', realPages.length);
      setPages(realPages);
    } catch (error) {
      console.error('Watermark - Error generating PDF pages:', error);
      toast({
        title: "Error",
        description: "Failed to load PDF pages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    downloadBlob(convertedFile, 'PDFo_Watermark.pdf');
  };

  const handleAddWatermark = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      const watermarkedBlob = await addWatermarkToPDF(file, settings);
      setProgress(100);
      setConvertedFile(watermarkedBlob);
      
      // Track usage for dashboard - Fixed: Added missing tracking
      await trackToolUsage("Watermark PDF", "security", 1);
      
      toast({
        title: "Success!",
        description: "Watermark has been added to your PDF successfully. Download button available below.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add watermark. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Tools */}
        <div className="mb-8">
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center text-sm">
            ← Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="Watermark PDF tool">
            <i className="fas fa-tint" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Watermark PDF</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Add text or image watermarks to protect your PDF
          </p>
        </div>

        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Watermark Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</Label>
                    <Select value={watermarkType} onValueChange={(value: 'text' | 'image') => {
                      setWatermarkType(value);
                      setSettings(prev => ({ ...prev, type: value }));
                    }}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Watermark</SelectItem>
                        <SelectItem value="image">Image Watermark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {watermarkType === 'text' && (
                    <>
                      <div>
                        <Label htmlFor="watermark-text" className="text-sm font-medium text-gray-700 dark:text-gray-300">Text</Label>
                        <Input
                          id="watermark-text"
                          type="text"
                          value={settings.text || ''}
                          onChange={(e) => setSettings(prev => ({ ...prev, text: e.target.value }))}
                          placeholder="Enter watermark text"
                          className="mt-1"
                          data-testid="input-watermark-text"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="font-size" className="text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</Label>
                        <Input
                          id="font-size"
                          type="number"
                          value={settings.fontSize || 36}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || (parseInt(value) >= 12 && parseInt(value) <= 100)) {
                              setSettings(prev => ({ ...prev, fontSize: value === '' ? 36 : parseInt(value) }));
                            }
                          }}
                          onKeyDown={(e) => {
                            // Allow backspace, delete, tab, escape, enter, arrow keys
                            if ([8, 9, 27, 13, 37, 38, 39, 40, 46].includes(e.keyCode) ||
                                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                                (e.keyCode === 65 && e.ctrlKey) ||
                                (e.keyCode === 67 && e.ctrlKey) ||
                                (e.keyCode === 86 && e.ctrlKey) ||
                                (e.keyCode === 88 && e.ctrlKey)) {
                              return;
                            }
                            // Ensure that it is a number and stop the keypress
                            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                              e.preventDefault();
                            }
                          }}
                          min="12"
                          max="100"
                          placeholder="36"
                          className="mt-1"
                          data-testid="input-font-size"
                        />
                        <p className="text-xs text-gray-500 mt-1">Size between 12-100px</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="color" className="text-sm font-medium text-gray-700 dark:text-gray-300">Color</Label>
                        <Input
                          id="color"
                          type="color"
                          value={settings.color || '#ff0000'}
                          onChange={(e) => setSettings(prev => ({ ...prev, color: e.target.value }))}
                          className="mt-1 h-10"
                          data-testid="input-watermark-color"
                        />
                      </div>
                    </>
                  )}
                  
                  {watermarkType === 'image' && (
                    <div>
                      <Label htmlFor="watermark-image" className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Image</Label>
                      <div className="mt-1">
                        <input
                          id="watermark-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSettings(prev => ({ ...prev, imageFile: file }));
                            }
                          }}
                          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                          data-testid="input-watermark-image"
                        />
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                        {settings.imageFile && (
                          <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                            <p className="text-sm text-green-800 dark:text-green-200">✓ Image selected: {settings.imageFile.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Position</Label>
                    <Select value={settings.position} onValueChange={(value) => setSettings(prev => ({ ...prev, position: value as any }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Opacity: {Math.round(settings.opacity * 100)}%
                    </Label>
                    <Slider
                      value={[settings.opacity]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, opacity: value[0] }))}
                      max={1}
                      min={0.1}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rotation: {settings.rotation}°
                    </Label>
                    <Slider
                      value={[settings.rotation]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, rotation: value[0] }))}
                      max={360}
                      min={0}
                      step={15}
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button
                    onClick={handleAddWatermark}
                    disabled={isProcessing || (watermarkType === 'text' && !settings.text) || (watermarkType === 'image' && !settings.imageFile)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-add-watermark"
                  >
                    {isProcessing ? "Adding Watermark..." : "Add Watermark"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
                {pages.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {watermarkType === 'text' ? (
                        <span>Preview with watermark: "{settings.text}" at {Math.round(settings.opacity * 100)}% opacity</span>
                      ) : (
                        <span>Preview with image watermark{settings.imageFile ? `: ${settings.imageFile.name}` : ''} at {Math.round(settings.opacity * 100)}% opacity</span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                      {pages.slice(0, 4).map((page) => (
                        <div key={page.id} className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                          {/* Page Number Badge */}
                          <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                            {page.pageNumber}
                          </div>
                          
                          {/* Watermark Preview Overlay */}
                          <div 
                            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                            style={{
                              opacity: settings.opacity,
                              transform: `rotate(${settings.rotation}deg)`,
                            }}
                          >
                            {watermarkType === 'text' ? (
                              <div 
                                className="font-bold select-none"
                                style={{ 
                                  color: settings.color, 
                                  fontSize: `${Math.max((settings.fontSize || 36) / 4, 8)}px`,
                                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                                }}
                              >
                                {settings.text || 'WATERMARK'}
                              </div>
                            ) : settings.imageFile ? (
                              <div className="w-8 h-8 bg-teal-200 dark:bg-teal-700 rounded border border-teal-400 flex items-center justify-center text-xs font-semibold text-teal-800 dark:text-teal-200">
                                IMG
                              </div>
                            ) : (
                              <div className="text-xs text-gray-500 font-medium">
                                No Image
                              </div>
                            )}
                          </div>
                          
                          {/* Page Content */}
                          <div className="aspect-[3/4]">
                            <SinglePDFThumbnail 
                              file={file} 
                              pageNumber={page.pageNumber}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {pages.length > 4 && (
                      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Showing first 4 pages. Watermark will be applied to all {pages.length} pages.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Upload a PDF to see preview with watermark</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {file && (
          <>
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="green"
              className="mt-6"
            />
            
            {/* Download Button */}
            {convertedFile && !isProcessing && (
              <div className="text-center space-y-4 mt-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                  <p className="text-green-800 dark:text-green-200 font-medium mb-2">
                    ✅ Watermark Added Successfully!
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Your PDF is ready with the {watermarkType} watermark applied.
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-8 py-4 text-lg font-medium bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  data-testid="button-download-watermarked"
                >
                  <i className="fas fa-download mr-3"></i>
                  Download Watermarked PDF
                </button>
                <div className="mt-4">
                  <BuyMeCoffeeButton />
                </div>
              </div>
            )}
            
            {!convertedFile && !isProcessing && (
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
import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { compressPDF, downloadBlob, type CompressionLevel } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import { SEOHead } from "@/components/SEOHead";
import { toolSEOData } from "@/lib/seo-data";

export default function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel['level'] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const seoData = toolSEOData['/compress-pdf'];

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0];
    console.log('Compress - Selected file:', selectedFile.name, selectedFile.size);
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setCompressedSize(null);
    setCompressionLevel(null);
    setCompressedBlob(null);
  };

  const handleDownload = () => {
    if (!compressedBlob) return;
    downloadBlob(compressedBlob, 'PDFo_Compress.pdf');
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getReductionPercentage = () => {
    if (!compressedSize) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };

  const handleCompress = async (level: CompressionLevel['level']) => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      const compressionSettings: CompressionLevel = {
        level,
        quality: level === 'low' ? 80 : level === 'medium' ? 60 : 40
      };
      
      setProgress(70);
      const processedBlob = await compressPDF(file, compressionSettings);
      setCompressedSize(processedBlob.size);
      setCompressionLevel(level);
      setCompressedBlob(processedBlob);
      setProgress(100);
      
      // Track usage for dashboard
      await trackToolUsage("Compress PDF", "optimization", 1);
      
      toast({
        title: "Success!",
        description: `PDF compressed successfully. Size reduced by ${getReductionPercentage()}%. Download button available below.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to compress PDF. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
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
        canonicalUrl={`${window.location.origin}/compress-pdf`}
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
          <div className="w-16 h-16 bg-gray-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="Compress PDF tool">
            <i className="fas fa-compress-alt" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{seoData.h1}</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            {seoData.content}
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Smart Compression
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
            accept=".pdf"
            maxSize={10 * 1024 * 1024}
            acceptMultiple={false}
            className="max-w-md mx-auto"
          />
        ) : (
          <>
            {/* File Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-file-pdf text-red-600 dark:text-red-400 text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {file.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Original size: {formatFileSize(originalSize)}
                  </p>
                </div>
              </div>

              {/* Compression Results */}
              {compressedSize && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        ✅ Compression Complete!
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Size reduced from {formatFileSize(originalSize)} to {formatFileSize(compressedSize)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-800 dark:text-green-200">
                        -{getReductionPercentage()}%
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        saved {formatFileSize(originalSize - compressedSize)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Choose Compression Level
              </h4>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleCompress('low')}
                  disabled={isProcessing}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    compressionLevel === 'low' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white">Low Compression</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Best quality, minimal size reduction</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">~10-20%</span>
                      <p className="text-xs text-gray-500">smaller</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleCompress('medium')}
                  disabled={isProcessing}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    compressionLevel === 'medium' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white">Medium Compression</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Balanced quality and size reduction</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-orange-600 dark:text-orange-400">~30-50%</span>
                      <p className="text-xs text-gray-500">smaller</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleCompress('high')}
                  disabled={isProcessing}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    compressionLevel === 'high' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white">High Compression</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Maximum size reduction, lower quality</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-red-600 dark:text-red-400">~50-70%</span>
                      <p className="text-xs text-gray-500">smaller</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Warning for high compression */}
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                <div className="flex items-start">
                  <i className="fas fa-exclamation-triangle text-amber-600 dark:text-amber-400 mt-0.5 mr-2"></i>
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Higher compression levels reduce file size more but may slightly affect image quality.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            {compressedBlob && !isProcessing && (
              <div className="text-center space-y-4 mt-6">
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-8"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download Compressed PDF
                </Button>
              </div>
            )}

            {/* New File Button */}
            <div className="text-center mb-6">
              <Button
                onClick={() => {
                  setFile(null);
                  setOriginalSize(0);
                  setCompressedSize(null);
                  setCompressionLevel(null);
                  setCompressedBlob(null);
                }}
                variant="outline"
                className="mr-4"
              >
                <i className="fas fa-upload mr-2"></i>
                Upload Different File
              </Button>
            </div>
          </>
        )}

        <ProgressBar 
          progress={progress} 
          isVisible={isProcessing} 
          color="blue"
          className="mt-6"
        />
        
        {!isProcessing && (
          <div className="text-center mt-6">
            <BuyMeCoffeeButton />
          </div>
        )}
      </div>

      <ToolFooter />
    </>
  );
}
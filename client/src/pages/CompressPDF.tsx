import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { compressPDF, downloadBlob, type CompressionLevel } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";

export default function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel['level'] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setCompressedSize(null);
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
      const compressedBlob = await compressPDF(file, compressionSettings);
      setCompressedSize(compressedBlob.size);
      setCompressionLevel(level);
      setProgress(100);
      
      downloadBlob(compressedBlob, 'compressed-document.pdf');
      
      toast({
        title: "Success!",
        description: `PDF compressed successfully. Size reduced by ${getReductionPercentage()}%.`,
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Tools */}
        <div className="mb-8">
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center text-sm">
            ← Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4">
            <i className="fas fa-compress-alt"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Compress PDF</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Reduce your PDF file size while maintaining quality
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
            acceptMultiple={false}
          />
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400">Original Size</p>
                  <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                    {formatFileSize(originalSize)}
                  </p>
                </div>
                
                {compressedSize && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400">Compressed Size</p>
                    <p className="text-lg font-semibold text-green-800 dark:text-green-200">
                      {formatFileSize(compressedSize)}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Reduced by {getReductionPercentage()}%
                    </p>
                  </div>
                )}
              </div>

              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Compression Level</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  onClick={() => handleCompress('low')}
                  disabled={isProcessing}
                  variant={compressionLevel === 'low' ? 'default' : 'outline'}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <span className="font-semibold">Low</span>
                  <span className="text-xs mt-1">Best Quality</span>
                  <span className="text-xs text-gray-500">~10-20% smaller</span>
                </Button>
                
                <Button
                  onClick={() => handleCompress('medium')}
                  disabled={isProcessing}
                  variant={compressionLevel === 'medium' ? 'default' : 'outline'}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <span className="font-semibold">Medium</span>
                  <span className="text-xs mt-1">Balanced</span>
                  <span className="text-xs text-gray-500">~30-50% smaller</span>
                </Button>
                
                <Button
                  onClick={() => handleCompress('high')}
                  disabled={isProcessing}
                  variant={compressionLevel === 'high' ? 'default' : 'outline'}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <span className="font-semibold">High</span>
                  <span className="text-xs mt-1">Smallest Size</span>
                  <span className="text-xs text-gray-500">~50-70% smaller</span>
                </Button>
              </div>
              
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <i className="fas fa-info-circle mr-2"></i>
                  Higher compression levels reduce file size more but may slightly affect image quality.
                </p>
              </div>
            </div>
            
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
          </>
        )}
      </div>

      <ToolFooter />
    </>
  );
}
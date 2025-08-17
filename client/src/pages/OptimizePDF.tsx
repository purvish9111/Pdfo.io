import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { optimizePDF, downloadBlob } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";

export default function OptimizePDF() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    setFile(files[0]);
  };

  const handleOptimize = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      const optimizedBlob = await optimizePDF(file);
      setProgress(100);
      downloadBlob(optimizedBlob, 'optimized-document.pdf');
      
      const originalSize = (file.size / 1024 / 1024).toFixed(1);
      const optimizedSize = (optimizedBlob.size / 1024 / 1024).toFixed(1);
      const savings = ((1 - optimizedBlob.size / file.size) * 100).toFixed(1);
      
      toast({
        title: "Success!",
        description: `PDF optimized! Size reduced from ${originalSize}MB to ${optimizedSize}MB (${savings}% savings).`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to optimize PDF. Please try again.",
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
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4">
            <i className="fas fa-magic"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">PDF Optimizer</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Optimize your PDF to reduce file size without losing quality
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Smaller Size
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Same Quality
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Fast Processing
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Optimization Ready</h3>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <i className="fas fa-file-pdf text-red-500 mr-2"></i>
                  <span>{file.name}</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <i className="fas fa-info-circle text-blue-500 mt-0.5 mr-3"></i>
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                      What gets optimized:
                    </p>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Removes unused objects and resources</li>
                      <li>• Compresses internal PDF structure</li>
                      <li>• Optimizes fonts and metadata</li>
                    </ul>
                  </div>
                </div>
              </div>

              {isProcessing && <ProgressBar progress={progress} isVisible={true} className="mb-4" />}

              <div className="flex gap-3">
                <Button
                  onClick={handleOptimize}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic mr-2"></i>
                      Optimize PDF
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setFile(null)}
                  disabled={isProcessing}
                >
                  Choose Different File
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      
      <ToolFooter />
      <BuyMeCoffeeButton />
    </>
  );
}
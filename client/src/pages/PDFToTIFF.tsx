import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { convertPDFToImages, downloadBlob, type ImageConversionOptions } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";

export default function PDFToTIFF() {
  const [file, setFile] = useState<File | null>(null);
  const [compressionType, setCompressionType] = useState<'none' | 'lzw' | 'jpeg'>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    setFile(files[0]);
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      const options: ImageConversionOptions = { compressionType };
      setProgress(70);
      const zipBlob = await convertPDFToImages(file, 'tiff', options);
      setProgress(100);
      downloadBlob(zipBlob, 'pdf-tiff-images.zip');
      toast({
        title: "Success!",
        description: "PDF has been converted to TIFF images successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert PDF to TIFF. Please try again.",
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
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="PDF to TIFF conversion tool">
            <i className="fas fa-file-image" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">PDF to TIFF</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Convert your PDF pages to TIFF format with compression options
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Professional Format
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Compression Options
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Conversion Options</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Compression Type</Label>
                  <Select value={compressionType} onValueChange={(value: 'none' | 'lzw' | 'jpeg') => setCompressionType(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Uncompressed)</SelectItem>
                      <SelectItem value="lzw">LZW Compression</SelectItem>
                      <SelectItem value="jpeg">JPEG Compression</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Choose compression method for file size vs quality balance
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {isProcessing ? "Converting..." : "Convert to TIFF"}
                </Button>
              </div>
              
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <i className="fas fa-info-circle mr-2"></i>
                  All pages will be converted to TIFF format and downloaded as a ZIP file.
                </p>
              </div>
            </div>
            
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="amber"
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
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { convertPDFToPPT, downloadBlob } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";

export default function PDFToPPT() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = (files: File[]) => {
    setFile(files[0]);
    setConvertedFile(null);
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    downloadBlob(convertedFile, 'converted-presentation.pptx');
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      setProgress(70);
      const pptBlob = await convertPDFToPPT(file);
      setProgress(100);
      setConvertedFile(pptBlob);
      toast({
        title: "Success!",
        description: "PDF has been converted to PowerPoint presentation successfully. Download button available below.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert PDF to PowerPoint. Please try again.",
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
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="PDF to PowerPoint conversion tool">
            <i className="fas fa-file-powerpoint" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">PDF to PPT</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Convert your PDF pages to PowerPoint presentation slides
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Slide Format
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Editable Slides
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ready to Convert</h3>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>File:</strong> {file.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Each PDF page will become a separate PowerPoint slide.
                </p>
              </div>
              
              <div className="mt-6">
                <Button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isProcessing ? "Converting..." : "Convert to PPT"}
                </Button>
              </div>
              
              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  <i className="fas fa-info-circle mr-2"></i>
                  The converted presentation will be saved as a .pptx file compatible with PowerPoint.
                </p>
              </div>
            </div>
            
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="orange"
              className="mt-6"
            />
            
            {/* Download Button */}
            {convertedFile && !isProcessing && (
              <div className="text-center space-y-4 mt-6">
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-8"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download PowerPoint Presentation
                </Button>
                <BuyMeCoffeeButton />
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
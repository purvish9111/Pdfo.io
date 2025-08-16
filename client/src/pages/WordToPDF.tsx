import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { convertWordToPDF, downloadBlob } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";

export default function WordToPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0];
    if (selectedFile && (selectedFile.name.endsWith('.docx') || selectedFile.name.endsWith('.doc'))) {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file format",
        description: "Please select a Word document (.docx or .doc file).",
        variant: "destructive",
      });
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      setProgress(70);
      const pdfBlob = await convertWordToPDF(file);
      setProgress(100);
      downloadBlob(pdfBlob, 'converted-from-word.pdf');
      toast({
        title: "Success!",
        description: "Word document has been converted to PDF successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert Word document to PDF. Please try again.",
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
          <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4">
            <i className="fas fa-file-word"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Word to PDF</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Convert Word documents to PDF format
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Fast Conversion
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Preserves Layout
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
            accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
            title="Drag and drop Word document here"
            subtitle="or click to select a .docx or .doc file"
          />
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ready to Convert</h3>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-3">
                    <i className="fas fa-file-word"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                >
                  {isProcessing ? "Converting..." : "Convert to PDF"}
                </Button>
              </div>
              
              <div className="mt-4 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                <p className="text-sm text-sky-700 dark:text-sky-300">
                  <i className="fas fa-info-circle mr-2"></i>
                  Your Word document will be converted to a PDF file preserving the original formatting.
                </p>
              </div>
            </div>
            
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="sky"
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
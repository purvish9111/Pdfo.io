import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addHeadersFooters, downloadBlob } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";

export default function AddHeaderFooter() {
  const [file, setFile] = useState<File | null>(null);
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    setFile(files[0]);
  };

  const handleAddHeaderFooter = async () => {
    if (!file || (!headerText && !footerText)) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      const modifiedBlob = await addHeadersFooters(file, headerText, footerText);
      setProgress(100);
      downloadBlob(modifiedBlob, 'header-footer-added.pdf');
      toast({
        title: "Success!",
        description: "Header and footer have been added to your PDF.",
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
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4">
            <i className="fas fa-align-center"></i>
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
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Header & Footer Settings</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="header" className="text-sm font-medium text-gray-700 dark:text-gray-300">Header Text (optional)</Label>
                  <Input
                    id="header"
                    type="text"
                    placeholder="e.g., Company Name - Document Title"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="footer" className="text-sm font-medium text-gray-700 dark:text-gray-300">Footer Text (optional)</Label>
                  <Input
                    id="footer"
                    type="text"
                    placeholder="e.g., Confidential - Page {n}"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <i className="fas fa-file-pdf text-red-500 mr-2"></i>
                  <span>{file.name}</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>

              {isProcessing && <ProgressBar progress={progress} isVisible={true} className="mb-4" />}

              <div className="flex gap-3">
                <Button
                  onClick={handleAddHeaderFooter}
                  disabled={isProcessing || (!headerText && !footerText)}
                  className="flex-1"
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
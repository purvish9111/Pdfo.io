import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { convertPDFToTXT, downloadBlob, type DocumentConversionOptions } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";

export default function PDFToTXT() {
  const [file, setFile] = useState<File | null>(null);
  const [includePageBreaks, setIncludePageBreaks] = useState(true);
  const [lineEndingStyle, setLineEndingStyle] = useState<'unix' | 'windows' | 'mac'>('unix');
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
      const options: DocumentConversionOptions = { includePageBreaks, lineEndingStyle };
      setProgress(70);
      const txtBlob = await convertPDFToTXT(file, options);
      setProgress(100);
      downloadBlob(txtBlob, 'converted-text.txt');
      toast({
        title: "Success!",
        description: "PDF has been converted to plain text successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert PDF to text. Please try again.",
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
          <div className="w-16 h-16 bg-slate-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="PDF to text conversion tool">
            <i className="fas fa-file-alt" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">PDF to TXT</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Extract plain text content from your PDF document
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Plain Text
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Format Options
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
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Include Page Breaks</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Add markers between pages in the output
                    </p>
                  </div>
                  <Switch
                    checked={includePageBreaks}
                    onCheckedChange={setIncludePageBreaks}
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Line Ending Style</Label>
                  <Select value={lineEndingStyle} onValueChange={(value: 'unix' | 'windows' | 'mac') => setLineEndingStyle(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unix">Unix/Linux (LF)</SelectItem>
                      <SelectItem value="windows">Windows (CRLF)</SelectItem>
                      <SelectItem value="mac">Mac (CR)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Choose line ending format for your operating system
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white"
                >
                  {isProcessing ? "Converting..." : "Convert to TXT"}
                </Button>
              </div>
              
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <i className="fas fa-info-circle mr-2"></i>
                  The text content will be extracted and saved as a plain .txt file.
                </p>
              </div>
            </div>
            
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="slate"
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
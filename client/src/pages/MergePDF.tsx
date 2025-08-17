import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { DocumentsList } from "@/components/DocumentsList";
import { Button } from "@/components/ui/button";
import { ToolFooter } from "@/components/ToolFooter";
import { mergePDFs } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { Download, Coffee } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { toolSEOData } from "@/lib/seo-data";

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const seoData = toolSEOData['/merge'];

  const handleFilesSelected = (selectedFiles: File[]) => {
    // Allow adding more files to existing ones
    setFiles(prev => [...prev, ...selectedFiles]);
    // Clear any previous merge result
    setMergedPdfUrl(null);
  };

  const handleFilesReorder = (reorderedFiles: File[]) => {
    setFiles(reorderedFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    
    setIsProcessing(true);
    setProgress(0);
    setMergedPdfUrl(null);
    
    try {
      // Simulate progress updates during merge
      setProgress(10);
      
      const mergedBlob = await mergePDFs(files, (current, total) => {
        // Update progress based on files processed
        const fileProgress = (current / total) * 80; // 80% for processing
        setProgress(10 + fileProgress);
      });
      
      setProgress(95);
      
      // Create download URL
      const url = URL.createObjectURL(mergedBlob);
      setMergedPdfUrl(url);
      
      setProgress(100);
      
      toast({
        title: "Success!",
        description: `Your ${files.length} PDF files have been merged successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to merge PDF files. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (mergedPdfUrl) {
      const a = document.createElement('a');
      a.href = mergedPdfUrl;
      a.download = 'merged-document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setMergedPdfUrl(null);
    setProgress(0);
  };

  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={`${window.location.origin}/merge`}
        structuredData={seoData.structuredData}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Tools */}
        <div className="mb-8">
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center text-sm">
            ← Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="Merge PDF tool">
            <i className="fas fa-layer-group" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{seoData.h1}</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            {seoData.content}
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Fast Processing
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

        {files.length === 0 ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={true}
          />
        ) : (
          <div className="space-y-6">
            <DocumentsList
              files={files}
              onFilesChange={setFiles}
              title="PDFs to Merge"
              allowPageReorder={true}
            />
            
            {/* Add More Files Button */}
            <div className="flex justify-center">
              <FileUpload
                onFilesSelected={handleFilesSelected}
                acceptMultiple={true}
                variant="button"
                buttonText="Add More Files"
                className="mb-4"
              />
            </div>

            {/* Progress Bar */}
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="blue"
              className="mt-6"
            />

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {!mergedPdfUrl ? (
                <>
                  <Button
                    onClick={handleMerge}
                    disabled={files.length < 2 || isProcessing}
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Merging...
                      </>
                    ) : (
                      `Merge ${files.length} PDF${files.length !== 1 ? 's' : ''}`
                    )}
                  </Button>
                  
                  <Button
                    onClick={clearFiles}
                    variant="outline"
                    size="lg"
                    className="px-8"
                  >
                    Clear All
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white px-8"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Merged PDF
                  </Button>
                  
                  {/* Buy Me Coffee Button */}
                  <div className="pt-2">
                    <a
                      href="https://buymeacoffee.com/pravaah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors"
                    >
                      <Coffee className="h-4 w-4 mr-2" />
                      Buy me a coffee
                    </a>
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      onClick={clearFiles}
                      variant="outline"
                      size="sm"
                    >
                      Start Over
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ToolFooter />
    </>
  );
}

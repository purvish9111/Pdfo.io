import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { editPDFMetadata, getPDFMetadata, downloadBlob, type PDFMetadata } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";

export default function EditMetadata() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<PDFMetadata>({
    title: '',
    author: '',
    subject: '',
    keywords: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [updatedBlob, setUpdatedBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setUpdatedBlob(null);
    
    // Load existing metadata
    const existingMetadata = await getPDFMetadata(selectedFile);
    setMetadata(existingMetadata);
  };

  const handleDownload = () => {
    if (!updatedBlob) return;
    downloadBlob(updatedBlob, 'metadata-updated.pdf');
  };

  const handleUpdateMetadata = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      const updatedBlob = await editPDFMetadata(file, metadata);
      setProgress(100);
      setUpdatedBlob(updatedBlob);
      toast({
        title: "Success!",
        description: "PDF metadata has been updated successfully. Download button available below.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update PDF metadata. Please try again.",
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
          <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="Edit PDF metadata tool">
            <i className="fas fa-edit" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Edit Metadata</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Edit your PDF's title, author, subject and keywords
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

        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
          />
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">PDF Metadata</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    value={metadata.title || ''}
                    onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter PDF title"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="author" className="text-sm font-medium text-gray-700 dark:text-gray-300">Author</Label>
                  <Input
                    id="author"
                    type="text"
                    value={metadata.author || ''}
                    onChange={(e) => setMetadata(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Enter author name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    value={metadata.subject || ''}
                    onChange={(e) => setMetadata(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter subject"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="keywords" className="text-sm font-medium text-gray-700 dark:text-gray-300">Keywords</Label>
                  <Input
                    id="keywords"
                    type="text"
                    value={metadata.keywords || ''}
                    onChange={(e) => setMetadata(prev => ({ ...prev, keywords: e.target.value }))}
                    placeholder="Enter keywords (comma separated)"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  onClick={handleUpdateMetadata}
                  disabled={isProcessing}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  {isProcessing ? "Updating..." : "Update Metadata"}
                </Button>
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
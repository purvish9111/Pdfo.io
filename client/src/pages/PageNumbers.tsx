import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { MainFooter } from "@/components/MainFooter";
import { ToolFooter } from "@/components/ToolFooter";
import { addPageNumbers, downloadBlob } from "@/lib/pdfUtils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Download, Upload, Coffee } from "lucide-react";

export default function PageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [options, setOptions] = useState({
    position: 'bottom' as 'top' | 'bottom',
    alignment: 'center' as 'left' | 'center' | 'right',
    startNumber: 1,
  });
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
  };

  const handleDownload = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const numberedBlob = await addPageNumbers(file, options);
      downloadBlob(numberedBlob, 'numbered-document.pdf');
      toast({
        title: "Success!",
        description: "Page numbers have been added to your PDF successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add page numbers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewUpload = () => {
    setFile(null);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Add Page Numbers</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Add customizable page numbers to your PDF documents with various positioning and formatting options.
          </p>
        </div>

        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
          />
        ) : (
          <div className="space-y-6">
            {/* File Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fas fa-file-pdf text-red-500 text-xl mr-3"></i>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(file.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Page Number Options */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Page Number Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Select 
                      value={options.position} 
                      onValueChange={(value: 'top' | 'bottom') => setOptions({...options, position: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Top of page</SelectItem>
                        <SelectItem value="bottom">Bottom of page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alignment">Alignment</Label>
                    <Select 
                      value={options.alignment} 
                      onValueChange={(value: 'left' | 'center' | 'right') => setOptions({...options, alignment: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select alignment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left aligned</SelectItem>
                        <SelectItem value="center">Center aligned</SelectItem>
                        <SelectItem value="right">Right aligned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startNumber">Start Number</Label>
                    <Input
                      id="startNumber"
                      type="number"
                      min="1"
                      value={options.startNumber}
                      onChange={(e) => setOptions({...options, startNumber: parseInt(e.target.value) || 1})}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Preview:</strong> Page numbers will be added {options.position} {options.alignment} starting from {options.startNumber}.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleDownload} 
                    disabled={isProcessing}
                    className="bg-pdfo-blue text-white hover:bg-blue-600 flex items-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isProcessing ? "Adding Page Numbers..." : "Download with Page Numbers"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleNewUpload}
                    className="flex items-center"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New File
                  </Button>
                </div>

                {/* Donation Button */}
                <div className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 mb-3">Did PDFo help you? Consider supporting us!</p>
                  <Button asChild className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                    <a 
                      href="https://buymeacoffee.com/pravaah" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      <Coffee className="mr-2 h-4 w-4" />
                      Buy me a coffee
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <ToolFooter />
      <MainFooter />
    </>
  );
}

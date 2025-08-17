import { useState } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { addWatermarkToPDF, downloadBlob, type WatermarkSettings } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";

export default function WatermarkPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [settings, setSettings] = useState<WatermarkSettings>({
    type: 'text',
    text: 'CONFIDENTIAL',
    opacity: 0.3,
    rotation: 45,
    fontSize: 36,
    color: '#ff0000',
    position: 'center',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    setFile(files[0]);
    setConvertedFile(null);
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    downloadBlob(convertedFile, 'watermarked-document.pdf');
  };

  const handleAddWatermark = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      const watermarkedBlob = await addWatermarkToPDF(file, settings);
      setProgress(100);
      setConvertedFile(watermarkedBlob);
      downloadBlob(watermarkedBlob, 'watermarked-document.pdf');
      toast({
        title: "Success!",
        description: "Watermark has been added to your PDF successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add watermark. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Tools */}
        <div className="mb-8">
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center text-sm">
            ← Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="Watermark PDF tool">
            <i className="fas fa-tint" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Watermark PDF</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Add text or image watermarks to protect your PDF
          </p>
        </div>

        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Watermark Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</Label>
                    <Select value={watermarkType} onValueChange={(value: 'text' | 'image') => {
                      setWatermarkType(value);
                      setSettings(prev => ({ ...prev, type: value }));
                    }}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Watermark</SelectItem>
                        <SelectItem value="image">Image Watermark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {watermarkType === 'text' && (
                    <>
                      <div>
                        <Label htmlFor="watermark-text" className="text-sm font-medium text-gray-700 dark:text-gray-300">Text</Label>
                        <Input
                          id="watermark-text"
                          type="text"
                          value={settings.text || ''}
                          onChange={(e) => setSettings(prev => ({ ...prev, text: e.target.value }))}
                          placeholder="Enter watermark text"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="font-size" className="text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</Label>
                        <Input
                          id="font-size"
                          type="number"
                          value={settings.fontSize || 36}
                          onChange={(e) => setSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                          min="12"
                          max="72"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="color" className="text-sm font-medium text-gray-700 dark:text-gray-300">Color</Label>
                        <Input
                          id="color"
                          type="color"
                          value={settings.color || '#ff0000'}
                          onChange={(e) => setSettings(prev => ({ ...prev, color: e.target.value }))}
                          className="mt-1 h-10"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Position</Label>
                    <Select value={settings.position} onValueChange={(value) => setSettings(prev => ({ ...prev, position: value as any }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Opacity: {Math.round(settings.opacity * 100)}%
                    </Label>
                    <Slider
                      value={[settings.opacity]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, opacity: value[0] }))}
                      max={1}
                      min={0.1}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rotation: {settings.rotation}°
                    </Label>
                    <Slider
                      value={[settings.rotation]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, rotation: value[0] }))}
                      max={360}
                      min={0}
                      step={15}
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button
                    onClick={handleAddWatermark}
                    disabled={isProcessing || (watermarkType === 'text' && !settings.text)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    {isProcessing ? "Adding Watermark..." : "Add Watermark"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">PDF preview with watermark will appear here</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {file && (
          <>
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="green"
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
                  Download Watermarked PDF
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
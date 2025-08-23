import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Upload, Download, FileImage, Compress, X, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

interface CompressedImage {
  id: string;
  file: File;
  originalSize: number;
  compressedSize: number;
  compressedUrl: string;
  compressionRatio: number;
}

export default function ImageCompressor() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState([80]);
  const { trackEvent } = useAnalytics();

  // SEO Setup
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Update page title and meta description
    document.title = 'Free Image Compressor - Compress JPG/PNG Images Online | PDFo';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Compress JPG and PNG images online without quality loss. Reduce file size while maintaining image quality. Free, fast, and secure image compression tool.');
    }
  }, []);

  const compressImage = (file: File, quality: number): Promise<{ blob: Blob; url: string }> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({ blob, url });
          }
        }, file.type, quality / 100);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const processImages = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    const newImages: CompressedImage[] = [];
    
    try {
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid File",
            description: `${file.name} is not a valid image file.`,
            variant: "destructive",
          });
          continue;
        }
        
        const { blob, url } = await compressImage(file, quality[0]);
        const compressedSize = blob.size;
        const compressionRatio = Math.round(((file.size - compressedSize) / file.size) * 100);
        
        newImages.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          originalSize: file.size,
          compressedSize,
          compressedUrl: url,
          compressionRatio,
        });
      }
      
      setImages(prev => [...prev, ...newImages]);
      trackEvent('tool_used', 'image_compressor', `compressed_${newImages.length}_images`);
      
      toast({
        title: "Success!",
        description: `Compressed ${newImages.length} image(s) successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to compress images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    processImages(acceptedFiles);
  }, [quality]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    multiple: true,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadImage = (image: CompressedImage) => {
    const link = document.createElement('a');
    link.href = image.compressedUrl;
    link.download = `compressed_${image.file.name}`;
    link.click();
    
    trackEvent('file_downloaded', 'image_compressor', 'single_download');
  };

  const downloadAll = () => {
    images.forEach(image => {
      downloadImage(image);
    });
    trackEvent('file_downloaded', 'image_compressor', 'bulk_download');
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      const toRemove = prev.find(img => img.id === id);
      if (toRemove) {
        URL.revokeObjectURL(toRemove.compressedUrl);
      }
      return updated;
    });
  };

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.compressedUrl));
    setImages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors">
            ← Back to PDFo
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Free Image Compressor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Compress JPG and PNG images without quality loss. Reduce file size while maintaining visual quality.
          </p>
        </div>

        {/* Quality Control */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Compress className="w-5 h-5 mr-2 text-green-600" />
              Compression Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Quality: {quality[0]}%
                </label>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Highest Compression</span>
                  <span>Best Quality</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragActive
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                or click to select files
              </p>
              <Button disabled={isProcessing}>
                <FileImage className="w-4 h-4 mr-2" />
                Select Images
              </Button>
              <p className="text-xs text-gray-400 mt-4">
                Supports: JPG, PNG, WebP • Max 50 images
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Processing */}
        {isProcessing && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="text-gray-700 dark:text-gray-300">Compressing images...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Compressed Images ({images.length})
                </span>
                <div className="space-x-2">
                  <Button onClick={downloadAll} size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                  <Button onClick={clearAll} variant="outline" size="sm">
                    Clear All
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {images.map((image) => (
                  <div key={image.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                          {image.file.name}
                        </h3>
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div>
                            <span className="font-medium">Original:</span> {formatFileSize(image.originalSize)}
                          </div>
                          <div>
                            <span className="font-medium">Compressed:</span> {formatFileSize(image.compressedSize)}
                          </div>
                          <div className="text-green-600">
                            <span className="font-medium">Saved:</span> {image.compressionRatio}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button onClick={() => downloadImage(image)} size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => removeImage(image.id)} variant="outline" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Compress className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart Compression</h3>
            <p className="text-gray-600 dark:text-gray-300">Advanced algorithms maintain image quality while reducing file size significantly.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileImage className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Multiple Formats</h3>
            <p className="text-gray-600 dark:text-gray-300">Support for JPG, PNG, and WebP image formats with batch processing.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Privacy First</h3>
            <p className="text-gray-600 dark:text-gray-300">All compression happens in your browser. Images never leave your device.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
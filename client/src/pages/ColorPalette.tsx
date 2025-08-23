import { useState, useEffect, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Palette, Upload, Copy, Download, RefreshCw, Eye, Pipette } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/use-analytics';

interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
  name?: string;
}

interface ExtractedColor extends ColorInfo {
  percentage: number;
}

export default function ColorPalette() {
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [customColor, setCustomColor] = useState('#3b82f6');
  const [colorHistory, setColorHistory] = useState<ColorInfo[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { trackEvent } = useAnalytics();

  // SEO Setup
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Free Color Palette Generator - Extract Colors from Images | PDFo';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Extract dominant colors from images and create color palettes. Get HEX, RGB, and HSL color codes. Free color picker and palette generator tool.');
    }

    // Load saved color history
    const savedHistory = localStorage.getItem('colorHistory');
    if (savedHistory) {
      setColorHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Convert RGB to HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): string => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  // Get color name (simplified)
  const getColorName = (hex: string): string => {
    const colorNames: { [key: string]: string } = {
      '#ff0000': 'Red', '#00ff00': 'Green', '#0000ff': 'Blue',
      '#ffff00': 'Yellow', '#ff00ff': 'Magenta', '#00ffff': 'Cyan',
      '#ffffff': 'White', '#000000': 'Black', '#808080': 'Gray',
      '#ffa500': 'Orange', '#800080': 'Purple', '#ffc0cb': 'Pink',
      '#a52a2a': 'Brown', '#008000': 'Dark Green', '#000080': 'Navy',
    };
    
    return colorNames[hex.toLowerCase()] || 'Custom Color';
  };

  // Extract colors from image using k-means clustering (simplified)
  const extractColorsFromImage = (imageData: ImageData): ExtractedColor[] => {
    const data = imageData.data;
    const pixels: [number, number, number][] = [];
    
    // Sample pixels (every 4th pixel for performance)
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];
      
      if (alpha > 128) { // Skip transparent pixels
        pixels.push([r, g, b]);
      }
    }

    // Simple color clustering - group similar colors
    const colorMap = new Map<string, { count: number; r: number; g: number; b: number }>();
    
    pixels.forEach(([r, g, b]) => {
      // Round to nearest 32 to group similar colors
      const roundedR = Math.round(r / 32) * 32;
      const roundedG = Math.round(g / 32) * 32;
      const roundedB = Math.round(b / 32) * 32;
      const key = `${roundedR}-${roundedG}-${roundedB}`;
      
      if (colorMap.has(key)) {
        const color = colorMap.get(key)!;
        color.count++;
        color.r = (color.r + r) / 2;
        color.g = (color.g + g) / 2;
        color.b = (color.b + b) / 2;
      } else {
        colorMap.set(key, { count: 1, r, g, b });
      }
    });

    // Sort by frequency and take top colors
    const sortedColors = Array.from(colorMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const totalPixels = pixels.length;
    
    return sortedColors.map(color => {
      const r = Math.round(color.r);
      const g = Math.round(color.g);
      const b = Math.round(color.b);
      const hex = rgbToHex(r, g, b);
      const percentage = Math.round((color.count / totalPixels) * 100);
      
      return {
        hex,
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: rgbToHsl(r, g, b),
        name: getColorName(hex),
        percentage,
      };
    });
  };

  const processImage = (file: File) => {
    setIsProcessing(true);
    const img = new Image();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    img.onload = () => {
      // Set canvas size
      const maxSize = 400;
      const ratio = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Extract colors
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const colors = extractColorsFromImage(imageData);
      
      setExtractedColors(colors);
      setUploadedImage(URL.createObjectURL(file));
      setIsProcessing(false);
      
      trackEvent('tool_used', 'color_palette', 'colors_extracted');
      
      toast({
        title: "Success!",
        description: `Extracted ${colors.length} dominant colors from your image.`,
      });
    };

    img.src = URL.createObjectURL(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a valid image file.",
        variant: "destructive",
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false,
  });

  const copyColor = (color: string, format: string) => {
    navigator.clipboard.writeText(color).then(() => {
      toast({
        title: "Copied!",
        description: `${format} color code copied to clipboard.`,
      });
      trackEvent('copy_content', 'color_palette', `${format}_copied`);
    });
  };

  const addToHistory = (color: ColorInfo) => {
    const newHistory = [color, ...colorHistory.filter(c => c.hex !== color.hex)].slice(0, 10);
    setColorHistory(newHistory);
    localStorage.setItem('colorHistory', JSON.stringify(newHistory));
  };

  const addCustomColor = () => {
    const hex = customColor;
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const colorInfo: ColorInfo = {
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: rgbToHsl(r, g, b),
      name: getColorName(hex),
    };
    
    addToHistory(colorInfo);
    trackEvent('tool_used', 'color_palette', 'custom_color_added');
  };

  const generateRandomPalette = () => {
    const colors: ExtractedColor[] = [];
    for (let i = 0; i < 6; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const hex = rgbToHex(r, g, b);
      
      colors.push({
        hex,
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: rgbToHsl(r, g, b),
        name: getColorName(hex),
        percentage: Math.floor(Math.random() * 30) + 10,
      });
    }
    
    setExtractedColors(colors);
    trackEvent('tool_used', 'color_palette', 'random_palette_generated');
  };

  const exportPalette = () => {
    const paletteData = {
      colors: extractedColors,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(paletteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'color-palette.json';
    link.click();
    URL.revokeObjectURL(url);
    
    trackEvent('file_downloaded', 'color_palette', 'palette_exported');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors">
            ← Back to PDFo
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Free Color Palette Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Extract dominant colors from images and create beautiful color palettes. Get HEX, RGB, and HSL color codes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload and Controls */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-pink-600" />
                  Extract Colors from Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDragActive
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-pink-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isDragActive ? 'Drop image here' : 'Drag & drop an image here'}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    or click to select a file
                  </p>
                  <Button disabled={isProcessing}>
                    <Pipette className="w-4 h-4 mr-2" />
                    Select Image
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Custom Color Picker */}
            <Card>
              <CardHeader>
                <CardTitle>Add Custom Color</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-16 h-16 rounded border cursor-pointer"
                  />
                  <div className="flex-1">
                    <Input
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      placeholder="#3b82f6"
                      pattern="^#[A-Fa-f0-9]{6}$"
                    />
                  </div>
                  <Button onClick={addCustomColor}>
                    Add Color
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={generateRandomPalette} variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Random Palette
                </Button>
                {extractedColors.length > 0 && (
                  <Button onClick={exportPalette} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Palette (JSON)
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Hidden Canvas */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Uploaded Image Preview */}
            {uploadedImage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-blue-600" />
                    Uploaded Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="w-full h-48 object-contain rounded border bg-gray-50 dark:bg-gray-800"
                  />
                </CardContent>
              </Card>
            )}

            {/* Extracted Colors */}
            {extractedColors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Extracted Color Palette</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {extractedColors.map((color, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                        <div 
                          className="w-full h-16 rounded mb-3 border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {color.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {color.percentage}%
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <code className="text-gray-600 dark:text-gray-400">{color.hex}</code>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => copyColor(color.hex, 'HEX')}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <code className="text-gray-600 dark:text-gray-400 text-xs">{color.rgb}</code>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => copyColor(color.rgb, 'RGB')}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <code className="text-gray-600 dark:text-gray-400 text-xs">{color.hsl}</code>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => copyColor(color.hsl, 'HSL')}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Color History */}
            {colorHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Colors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {colorHistory.map((color, index) => (
                      <div key={index} className="text-center">
                        <div 
                          className="w-full h-12 rounded mb-1 border cursor-pointer"
                          style={{ backgroundColor: color.hex }}
                          onClick={() => copyColor(color.hex, 'HEX')}
                          title={`Click to copy ${color.hex}`}
                        />
                        <code className="text-xs text-gray-600 dark:text-gray-400">
                          {color.hex}
                        </code>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart Extraction</h3>
            <p className="text-gray-600 dark:text-gray-300">Advanced algorithms identify dominant colors from any image.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Copy className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Multiple Formats</h3>
            <p className="text-gray-600 dark:text-gray-300">Get color codes in HEX, RGB, and HSL formats.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pipette className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Custom Colors</h3>
            <p className="text-gray-600 dark:text-gray-300">Add custom colors and build your own palettes.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Export Ready</h3>
            <p className="text-gray-600 dark:text-gray-300">Export palettes in various formats for design tools.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
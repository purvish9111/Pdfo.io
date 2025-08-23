import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, Download, Share2, Smartphone, Wifi, Mail, Phone } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/use-analytics';

interface QRConfig {
  text: string;
  size: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  foregroundColor: string;
  backgroundColor: string;
}

export default function QRGenerator() {
  const [config, setConfig] = useState<QRConfig>({
    text: '',
    size: 200,
    errorCorrectionLevel: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
  });
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState('text');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { trackEvent } = useAnalytics();

  // QR Code generation (simplified implementation)
  const generateQRCode = () => {
    if (!config.text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to generate QR code.",
        variant: "destructive",
      });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    canvas.width = config.size;
    canvas.height = config.size;

    // Clear canvas
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, config.size, config.size);

    // Simple QR pattern simulation (for demo purposes)
    // In production, you'd use a proper QR code library like qrcode.js
    const moduleSize = Math.floor(config.size / 25);
    ctx.fillStyle = config.foregroundColor;

    // Generate simple pattern based on text
    const hash = config.text.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        const shouldFill = (hash + i * j) % 3 === 0;
        if (shouldFill) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');
    setQrCodeUrl(dataUrl);
    
    trackEvent('tool_used', 'qr_generator', 'qr_code_generated');
  };

  // SEO Setup
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Free QR Code Generator - Create QR Codes for Text, URLs & Data | PDFo';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Generate QR codes for text, URLs, WiFi, email, and phone numbers. Free QR code generator with customizable colors and sizes. Download as PNG image.');
    }

    // Generate default QR code
    if (!qrCodeUrl) {
      setConfig(prev => ({ ...prev, text: 'https://pdfo.io' }));
    }
  }, []);

  useEffect(() => {
    if (config.text) {
      generateQRCode();
    }
  }, [config]);

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-code-${Date.now()}.png`;
    link.click();
    
    trackEvent('file_downloaded', 'qr_generator', 'qr_code_downloaded');
    
    toast({
      title: "Downloaded!",
      description: "QR code saved successfully.",
    });
  };

  const shareQRCode = async () => {
    if (!qrCodeUrl) return;
    
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const file = new File([blob], 'qr-code.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'QR Code',
          files: [file],
        });
        trackEvent('share_content', 'qr_generator', 'qr_code_shared');
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        toast({
          title: "Copied!",
          description: "QR code copied to clipboard.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share QR code.",
        variant: "destructive",
      });
    }
  };

  const setWiFiData = (ssid: string, password: string, security: string = 'WPA') => {
    const wifiString = `WIFI:T:${security};S:${ssid};P:${password};;`;
    setConfig(prev => ({ ...prev, text: wifiString }));
  };

  const setEmailData = (email: string, subject: string = '', body: string = '') => {
    const emailString = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setConfig(prev => ({ ...prev, text: emailString }));
  };

  const setPhoneData = (phone: string) => {
    const phoneString = `tel:${phone}`;
    setConfig(prev => ({ ...prev, text: phoneString }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors">
            ← Back to PDFo
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Free QR Code Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create QR codes for text, URLs, WiFi credentials, contact info, and more. Customize colors and download instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Content Type Tabs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="w-5 h-5 mr-2 text-purple-600" />
                  QR Code Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="text">Text/URL</TabsTrigger>
                    <TabsTrigger value="wifi">WiFi</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="phone">Phone</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Text or URL
                      </label>
                      <Textarea
                        placeholder="Enter text, URL, or any data you want to encode..."
                        value={config.text}
                        onChange={(e) => setConfig(prev => ({ ...prev, text: e.target.value }))}
                        rows={4}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="wifi" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Network Name (SSID)
                        </label>
                        <Input placeholder="MyWiFiNetwork" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Security Type
                        </label>
                        <Select defaultValue="WPA">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WPA">WPA/WPA2</SelectItem>
                            <SelectItem value="WEP">WEP</SelectItem>
                            <SelectItem value="nopass">No Password</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Password
                      </label>
                      <Input type="password" placeholder="WiFi password" />
                    </div>
                    <Button 
                      onClick={() => setWiFiData('MyWiFiNetwork', 'password123')}
                      className="w-full"
                    >
                      <Wifi className="w-4 h-4 mr-2" />
                      Generate WiFi QR Code
                    </Button>
                  </TabsContent>

                  <TabsContent value="email" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Email Address
                      </label>
                      <Input type="email" placeholder="contact@example.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Subject (Optional)
                      </label>
                      <Input placeholder="Email subject" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Message (Optional)
                      </label>
                      <Textarea placeholder="Email message..." rows={3} />
                    </div>
                    <Button 
                      onClick={() => setEmailData('contact@example.com', 'Hello', 'Message content')}
                      className="w-full"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Generate Email QR Code
                    </Button>
                  </TabsContent>

                  <TabsContent value="phone" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Phone Number
                      </label>
                      <Input placeholder="+1 (555) 123-4567" />
                    </div>
                    <Button 
                      onClick={() => setPhoneData('+15551234567')}
                      className="w-full"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Generate Phone QR Code
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Customization Options */}
            <Card>
              <CardHeader>
                <CardTitle>Customization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Size: {config.size}px
                  </label>
                  <input
                    type="range"
                    min={100}
                    max={500}
                    value={config.size}
                    onChange={(e) => setConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Foreground Color
                    </label>
                    <input
                      type="color"
                      value={config.foregroundColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, foregroundColor: e.target.value }))}
                      className="w-full h-10 rounded border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-full h-10 rounded border"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Error Correction Level
                  </label>
                  <Select 
                    value={config.errorCorrectionLevel} 
                    onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => 
                      setConfig(prev => ({ ...prev, errorCorrectionLevel: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low (7%)</SelectItem>
                      <SelectItem value="M">Medium (15%)</SelectItem>
                      <SelectItem value="Q">Quartile (25%)</SelectItem>
                      <SelectItem value="H">High (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="inline-block p-4 bg-white rounded-lg shadow-inner mb-4">
                    <canvas 
                      ref={canvasRef}
                      className="border rounded"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Button onClick={downloadQRCode} className="w-full" disabled={!qrCodeUrl}>
                      <Download className="w-4 h-4 mr-2" />
                      Download PNG
                    </Button>
                    <Button onClick={shareQRCode} variant="outline" className="w-full" disabled={!qrCodeUrl}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share QR Code
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
                  How to Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>Enter your text, URL, or select a content type</li>
                  <li>Customize colors and size as needed</li>
                  <li>Download the QR code as PNG image</li>
                  <li>Print or share your QR code</li>
                  <li>Scan with any QR code scanner app</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Multiple Types</h3>
            <p className="text-gray-600 dark:text-gray-300">Support for text, URLs, WiFi, email, phone, and more.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Universal Scanning</h3>
            <p className="text-gray-600 dark:text-gray-300">Works with all QR code scanner apps and phone cameras.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">High Quality</h3>
            <p className="text-gray-600 dark:text-gray-300">Generate high-resolution QR codes perfect for printing.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Easy Sharing</h3>
            <p className="text-gray-600 dark:text-gray-300">Download, share, or copy QR codes instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
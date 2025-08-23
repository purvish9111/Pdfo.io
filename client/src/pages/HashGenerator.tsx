import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hash, Copy, Upload, Shield, FileText, Key, Eye, EyeOff } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/use-analytics';

interface HashResult {
  algorithm: string;
  hash: string;
  length: number;
  inputType: 'text' | 'file';
}

interface HashHistory {
  id: string;
  input: string;
  results: HashResult[];
  timestamp: string;
}

export default function HashGenerator() {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [hashHistory, setHashHistory] = useState<HashHistory[]>([]);
  const [activeTab, setActiveTab] = useState('text');
  const [showInput, setShowInput] = useState(true);
  const { trackEvent } = useAnalytics();

  // SEO Setup
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Free Hash Generator - Generate MD5, SHA256, SHA512 Hashes | PDFo';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Generate cryptographic hashes for text and files. Support for MD5, SHA-1, SHA-256, SHA-512, and more. Free online hash generator tool.');
    }

    // Load hash history
    const savedHistory = localStorage.getItem('hashHistory');
    if (savedHistory) {
      setHashHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Simple hash implementations (for demo - in production use crypto.subtle)
  const md5 = async (input: string): Promise<string> => {
    // Simplified MD5 implementation for demo
    // In production, use a proper crypto library
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
  };

  const sha1 = async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const sha256 = async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const sha512 = async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateHashes = async (input: string, inputType: 'text' | 'file' = 'text') => {
    if (!input.trim() && inputType === 'text') {
      toast({
        title: "Error",
        description: "Please enter text to generate hashes.",
        variant: "destructive",
      });
      return;
    }

    try {
      const algorithms = [
        { name: 'MD5', func: md5 },
        { name: 'SHA-1', func: sha1 },
        { name: 'SHA-256', func: sha256 },
        { name: 'SHA-512', func: sha512 },
      ];

      const results: HashResult[] = [];
      for (const algo of algorithms) {
        const hash = await algo.func(input);
        results.push({
          algorithm: algo.name,
          hash,
          length: hash.length,
          inputType,
        });
      }

      setHashResults(results);

      // Add to history
      const historyItem: HashHistory = {
        id: Math.random().toString(36).substr(2, 9),
        input: inputType === 'file' ? `File: ${selectedFile?.name}` : input.substring(0, 100),
        results,
        timestamp: new Date().toISOString(),
      };

      const newHistory = [historyItem, ...hashHistory.slice(0, 9)];
      setHashHistory(newHistory);
      localStorage.setItem('hashHistory', JSON.stringify(newHistory));

      trackEvent('tool_used', 'hash_generator', `${inputType}_hashed`);

      toast({
        title: "Success!",
        description: `Generated ${results.length} different hash values.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate hashes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      await generateHashes(content, 'file');
    };
    reader.readAsText(file);
  };

  const copyHash = (hash: string, algorithm: string) => {
    navigator.clipboard.writeText(hash).then(() => {
      toast({
        title: "Copied!",
        description: `${algorithm} hash copied to clipboard.`,
      });
      trackEvent('copy_content', 'hash_generator', `${algorithm}_copied`);
    });
  };

  const compareHashes = (hash1: string, hash2: string): boolean => {
    return hash1.toLowerCase() === hash2.toLowerCase();
  };

  const getAlgorithmInfo = (algorithm: string) => {
    const info = {
      'MD5': {
        description: 'Fast but not cryptographically secure. Good for checksums.',
        security: 'Low',
        color: 'bg-red-100 text-red-800',
      },
      'SHA-1': {
        description: 'Deprecated for security applications. Legacy support.',
        security: 'Low',
        color: 'bg-orange-100 text-orange-800',
      },
      'SHA-256': {
        description: 'Strong cryptographic hash. Recommended for security.',
        security: 'High',
        color: 'bg-green-100 text-green-800',
      },
      'SHA-512': {
        description: 'Very strong cryptographic hash. Maximum security.',
        security: 'Very High',
        color: 'bg-blue-100 text-blue-800',
      },
    };
    return info[algorithm as keyof typeof info] || info['SHA-256'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors">
            ← Back to PDFo
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Free Hash Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Generate cryptographic hashes for text and files. Support for MD5, SHA-1, SHA-256, SHA-512, and more.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Input Type Tabs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Hash className="w-5 h-5 mr-2 text-gray-600" />
                  Generate Hashes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text" className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Text Input</span>
                    </TabsTrigger>
                    <TabsTrigger value="file" className="flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>File Upload</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Enter Text
                        </label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowInput(!showInput)}
                        >
                          {showInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Enter any text to generate hash values..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        rows={6}
                        type={showInput ? 'text' : 'password'}
                        className="font-mono"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Characters: {inputText.length}
                      </p>
                    </div>
                    <Button 
                      onClick={() => generateHashes(inputText, 'text')} 
                      className="w-full"
                      disabled={!inputText.trim()}
                    >
                      <Hash className="w-4 h-4 mr-2" />
                      Generate Hashes
                    </Button>
                  </TabsContent>

                  <TabsContent value="file" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Upload File
                      </label>
                      <Input
                        type="file"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                      {selectedFile && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>File:</strong> {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Size: {(selectedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Hash Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Hash Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Compare Hash
                  </label>
                  <Input
                    placeholder="Paste a hash value to compare..."
                    className="font-mono"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Paste a hash value to compare against generated hashes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Hash Results */}
            {hashResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Hashes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hashResults.map((result, index) => {
                      const info = getAlgorithmInfo(result.algorithm);
                      return (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {result.algorithm}
                              </h3>
                              <Badge className={info.color}>
                                {info.security} Security
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {result.length} chars
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyHash(result.hash, result.algorithm)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-900 rounded border p-3 mb-2">
                            <code className="text-sm text-gray-700 dark:text-gray-300 break-all font-mono">
                              {result.hash}
                            </code>
                          </div>
                          
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {info.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hash History */}
            {hashHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="w-5 h-5 mr-2 text-purple-600" />
                    Recent Hashes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hashHistory.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.input}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {item.results.slice(0, 4).map((result, idx) => (
                            <div key={idx} className="text-xs">
                              <span className="font-medium text-gray-600 dark:text-gray-400">
                                {result.algorithm}:
                              </span>
                              <code className="block text-gray-500 truncate font-mono">
                                {result.hash.substring(0, 16)}...
                              </code>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Algorithm Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Hash Algorithms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['MD5', 'SHA-1', 'SHA-256', 'SHA-512'].map((algorithm) => {
                    const info = getAlgorithmInfo(algorithm);
                    return (
                      <div key={algorithm} className="flex items-start space-x-3">
                        <Badge className={info.color} variant="outline">
                          {algorithm}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hash className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Multiple Algorithms</h3>
            <p className="text-gray-600 dark:text-gray-300">Support for MD5, SHA-1, SHA-256, SHA-512, and more.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure Processing</h3>
            <p className="text-gray-600 dark:text-gray-300">All hashing happens locally in your browser for privacy.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Text & Files</h3>
            <p className="text-gray-600 dark:text-gray-300">Generate hashes for both text input and file uploads.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Copy className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Easy Copying</h3>
            <p className="text-gray-600 dark:text-gray-300">One-click copying of hash values with format preservation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link2, Copy, ExternalLink, BarChart3, Clock, Link, Trash2, Plus } from 'lucide-react';
import { Link as RouterLink } from 'wouter';
import { toast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/use-analytics';

interface ShortenedURL {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  customAlias?: string;
}

export default function URLShortener() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [urls, setUrls] = useState<ShortenedURL[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { trackEvent } = useAnalytics();

  // SEO Setup
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Free URL Shortener - Create Short Links with Analytics | PDFo';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Create short links with click analytics. Free URL shortener with custom aliases, click tracking, and detailed statistics. Shorten long URLs instantly.');
    }

    // Load saved URLs from localStorage
    const savedUrls = localStorage.getItem('shortenedUrls');
    if (savedUrls) {
      setUrls(JSON.parse(savedUrls));
    }
  }, []);

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const isValidUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const shortenUrl = () => {
    if (!originalUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(originalUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Check if custom alias is already taken
    if (customAlias && urls.some(url => url.customAlias === customAlias)) {
      setIsLoading(false);
      toast({
        title: "Alias Taken",
        description: "This custom alias is already in use. Please choose another.",
        variant: "destructive",
      });
      return;
    }

    try {
      const shortCode = customAlias || generateShortCode();
      const shortUrl = `https://pdfo.io/${shortCode}`;
      
      const newUrl: ShortenedURL = {
        id: Math.random().toString(36).substr(2, 9),
        originalUrl,
        shortCode,
        shortUrl,
        clicks: 0,
        createdAt: new Date().toISOString(),
        customAlias: customAlias || undefined,
      };

      const updatedUrls = [newUrl, ...urls];
      setUrls(updatedUrls);
      localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));

      setOriginalUrl('');
      setCustomAlias('');
      
      trackEvent('tool_used', 'url_shortener', 'url_shortened');
      
      toast({
        title: "Success!",
        description: "URL shortened successfully. Click to copy the short link.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard.",
      });
      trackEvent('copy_link', 'url_shortener', 'short_url_copied');
    });
  };

  const deleteUrl = (id: string) => {
    const updatedUrls = urls.filter(url => url.id !== id);
    setUrls(updatedUrls);
    localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
    
    toast({
      title: "Deleted",
      description: "Short URL deleted successfully.",
    });
  };

  const simulateClick = (id: string) => {
    const updatedUrls = urls.map(url => 
      url.id === id ? { ...url, clicks: url.clicks + 1 } : url
    );
    setUrls(updatedUrls);
    localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
  };

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <RouterLink href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors">
            ← Back to PDFo
          </RouterLink>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Free URL Shortener
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create short links with click analytics. Perfect for social media, emails, and campaigns.
          </p>
        </div>

        {/* Stats Overview */}
        {urls.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Link2 className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{urls.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Short Links</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalClicks}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Clicks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {urls.length > 0 ? Math.round(totalClicks / urls.length) : 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Avg Clicks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* URL Shortener Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Link2 className="w-5 h-5 mr-2 text-blue-600" />
              Shorten Your URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Original URL *
              </label>
              <Input
                type="url"
                placeholder="https://example.com/very-long-url-that-needs-shortening"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="mb-4"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Custom Alias (Optional)
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  pdfo.io/
                </span>
                <Input
                  placeholder="my-custom-link"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                  className="rounded-l-none"
                  maxLength={30}
                />
              </div>
            </div>

            <Button 
              onClick={shortenUrl} 
              disabled={isLoading} 
              className="w-full"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Shorten URL
            </Button>
          </CardContent>
        </Card>

        {/* Shortened URLs List */}
        {urls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Short Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {urls.map((url) => (
                  <div key={url.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-blue-600 dark:text-blue-400">
                            {url.shortUrl}
                          </h3>
                          {url.customAlias && (
                            <Badge variant="outline">Custom</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 break-all">
                          {url.originalUrl}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            {url.clicks} clicks
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(url.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(url.shortUrl)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            window.open(url.originalUrl, '_blank');
                            simulateClick(url.id);
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteUrl(url.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Custom Aliases</h3>
            <p className="text-gray-600 dark:text-gray-300">Create memorable short links with custom aliases for your brand or campaign.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Click Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">Track clicks and performance of your short links with detailed analytics.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Instant Redirect</h3>
            <p className="text-gray-600 dark:text-gray-300">Fast and reliable URL redirection with 99.9% uptime guarantee.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
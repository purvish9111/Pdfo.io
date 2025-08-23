import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Key, Copy, RefreshCw, Shield, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/use-analytics';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

interface GeneratedPassword {
  password: string;
  strength: number;
  strengthLabel: string;
  strengthColor: string;
}

export default function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  });
  
  const [generatedPassword, setGeneratedPassword] = useState<GeneratedPassword | null>(null);
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);
  const { trackEvent } = useAnalytics();

  // SEO Setup
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Free Password Generator - Create Strong Secure Passwords | PDFo';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Generate strong, secure passwords with customizable options. Include uppercase, lowercase, numbers, and symbols. Free password generator with strength meter.');
    }

    // Generate initial password
    generatePassword();
  }, []);

  const getCharacterSet = (): string => {
    let charset = '';
    
    if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.includeNumbers) charset += '0123456789';
    if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (options.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }
    
    if (options.excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()\/\\'"~,;.<>]/g, '');
    }
    
    return charset;
  };

  const calculateStrength = (password: string): { strength: number; label: string; color: string } => {
    let score = 0;
    
    // Length bonus
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (password.length >= 16) score += 25;
    
    // Character variety
    if (/[a-z]/.test(password)) score += 5;
    if (/[A-Z]/.test(password)) score += 5;
    if (/[0-9]/.test(password)) score += 5;
    if (/[^A-Za-z0-9]/.test(password)) score += 10;
    
    // Avoid common patterns
    if (!/(.)\1{2,}/.test(password)) score += 5; // No repeating characters
    if (!/123|abc|qwe/i.test(password)) score += 5; // No sequential patterns
    
    let label = 'Very Weak';
    let color = 'bg-red-500';
    
    if (score >= 80) {
      label = 'Very Strong';
      color = 'bg-green-500';
    } else if (score >= 60) {
      label = 'Strong';
      color = 'bg-blue-500';
    } else if (score >= 40) {
      label = 'Medium';
      color = 'bg-yellow-500';
    } else if (score >= 20) {
      label = 'Weak';
      color = 'bg-orange-500';
    }
    
    return { strength: Math.min(score, 100), label, color };
  };

  const generatePassword = () => {
    const charset = getCharacterSet();
    
    if (!charset) {
      toast({
        title: "Error",
        description: "Please select at least one character type.",
        variant: "destructive",
      });
      return;
    }
    
    let password = '';
    const crypto = window.crypto || (window as any).msCrypto;
    
    if (crypto && crypto.getRandomValues) {
      const array = new Uint32Array(options.length);
      crypto.getRandomValues(array);
      
      for (let i = 0; i < options.length; i++) {
        password += charset[array[i] % charset.length];
      }
    } else {
      // Fallback for older browsers
      for (let i = 0; i < options.length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
      }
    }
    
    const strengthData = calculateStrength(password);
    
    setGeneratedPassword({
      password,
      ...strengthData,
    });
    
    // Add to history (keep last 5)
    setPasswordHistory(prev => [password, ...prev.slice(0, 4)]);
    
    trackEvent('tool_used', 'password_generator', 'password_generated');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Password copied to clipboard.",
      });
      trackEvent('copy_content', 'password_generator', 'password_copied');
    });
  };

  const getStrengthIcon = (strength: number) => {
    if (strength >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (strength >= 40) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <X className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors">
            ← Back to PDFo
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Free Password Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create strong, secure passwords with customizable options. Generate random passwords that are hard to crack.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Password Options */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2 text-red-600" />
                  Password Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Length */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Password Length: {options.length}
                  </label>
                  <input
                    type="range"
                    min={4}
                    max={50}
                    value={options.length}
                    onChange={(e) => setOptions(prev => ({ ...prev, length: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>4</span>
                    <span>50</span>
                  </div>
                </div>

                {/* Character Types */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Include Characters</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase"
                      checked={options.includeUppercase}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, includeUppercase: checked as boolean }))
                      }
                    />
                    <label htmlFor="uppercase" className="text-sm text-gray-700 dark:text-gray-300">
                      Uppercase Letters (A-Z)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowercase"
                      checked={options.includeLowercase}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, includeLowercase: checked as boolean }))
                      }
                    />
                    <label htmlFor="lowercase" className="text-sm text-gray-700 dark:text-gray-300">
                      Lowercase Letters (a-z)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers"
                      checked={options.includeNumbers}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, includeNumbers: checked as boolean }))
                      }
                    />
                    <label htmlFor="numbers" className="text-sm text-gray-700 dark:text-gray-300">
                      Numbers (0-9)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symbols"
                      checked={options.includeSymbols}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, includeSymbols: checked as boolean }))
                      }
                    />
                    <label htmlFor="symbols" className="text-sm text-gray-700 dark:text-gray-300">
                      Symbols (!@#$%^&*)
                    </label>
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Advanced Options</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="excludeSimilar"
                      checked={options.excludeSimilar}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, excludeSimilar: checked as boolean }))
                      }
                    />
                    <label htmlFor="excludeSimilar" className="text-sm text-gray-700 dark:text-gray-300">
                      Exclude similar characters (i, l, 1, L, o, 0, O)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="excludeAmbiguous"
                      checked={options.excludeAmbiguous}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, excludeAmbiguous: checked as boolean }))
                      }
                    />
                    <label htmlFor="excludeAmbiguous" className="text-sm text-gray-700 dark:text-gray-300">
                      Exclude ambiguous characters ({`{ } [ ] ( ) / \\ ' " ~ , ; . < >`})
                    </label>
                  </div>
                </div>

                <Button onClick={generatePassword} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New Password
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Password */}
          <div className="space-y-6">
            {generatedPassword && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-green-600" />
                      Generated Password
                    </span>
                    {getStrengthIcon(generatedPassword.strength)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Input
                      value={generatedPassword.password}
                      readOnly
                      className="pr-12 font-mono text-lg"
                      onClick={() => copyToClipboard(generatedPassword.password)}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => copyToClipboard(generatedPassword.password)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Strength Meter */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password Strength
                      </span>
                      <Badge variant="outline" className={`${generatedPassword.strengthColor.replace('bg-', 'border-')} text-white`}>
                        {generatedPassword.strengthLabel}
                      </Badge>
                    </div>
                    <Progress value={generatedPassword.strength} className="h-2" />
                    <p className="text-xs text-gray-500">
                      Strength: {generatedPassword.strength}/100
                    </p>
                  </div>

                  {/* Password Analysis */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Length:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{generatedPassword.password.length} characters</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Entropy:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">~{Math.round(generatedPassword.password.length * 4.7)} bits</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Password History */}
            {passwordHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Passwords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {passwordHistory.map((password, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <code className="font-mono text-sm text-gray-700 dark:text-gray-300 truncate flex-1 mr-2">
                          {password}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(password)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Security Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>Use unique passwords for each account</li>
                  <li>Enable two-factor authentication when available</li>
                  <li>Store passwords in a secure password manager</li>
                  <li>Never share passwords or write them down</li>
                  <li>Change passwords regularly, especially for important accounts</li>
                  <li>Avoid using personal information in passwords</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cryptographically Secure</h3>
            <p className="text-gray-600 dark:text-gray-300">Uses secure random number generation for maximum entropy.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Strength Analysis</h3>
            <p className="text-gray-600 dark:text-gray-300">Real-time password strength assessment and scoring.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Privacy First</h3>
            <p className="text-gray-600 dark:text-gray-300">Passwords generated locally. Nothing is stored or transmitted.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
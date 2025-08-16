import { useState } from 'react';
import { FileText, Download, Type, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PDFPage {
  id: string;
  pageNumber: number;
}

interface PageNumberSettings {
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  format: string;
  fontFamily: string;
  fontSize: number;
  color: string;
}

interface PageNumbersGridProps {
  file: File;
  pages: PDFPage[];
  onAddPageNumbers: (settings: PageNumberSettings) => void;
  isProcessing: boolean;
}

const POSITION_OPTIONS = [
  { value: 'top-left', label: 'Top Left', position: { top: '8px', left: '8px' } },
  { value: 'top-center', label: 'Top Center', position: { top: '8px', left: '50%', transform: 'translateX(-50%)' } },
  { value: 'top-right', label: 'Top Right', position: { top: '8px', right: '8px' } },
  { value: 'bottom-left', label: 'Bottom Left', position: { bottom: '8px', left: '8px' } },
  { value: 'bottom-center', label: 'Bottom Center', position: { bottom: '8px', left: '50%', transform: 'translateX(-50%)' } },
  { value: 'bottom-right', label: 'Bottom Right', position: { bottom: '8px', right: '8px' } },
];

const FONT_FAMILIES = [
  'Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana', 'Courier New'
];

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24];

const COLORS = [
  { value: '#000000', label: 'Black' },
  { value: '#333333', label: 'Dark Gray' },
  { value: '#666666', label: 'Gray' },
  { value: '#0066CC', label: 'Blue' },
  { value: '#CC0000', label: 'Red' },
  { value: '#00CC00', label: 'Green' },
];

export function PageNumbersGrid({ file, pages, onAddPageNumbers, isProcessing }: PageNumbersGridProps) {
  const [settings, setSettings] = useState<PageNumberSettings>({
    position: 'bottom-center',
    format: 'Page {n} of {total}',
    fontFamily: 'Arial',
    fontSize: 12,
    color: '#000000',
  });

  const handleSettingChange = (key: keyof PageNumberSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getFormattedPageNumber = (pageNum: number, totalPages: number) => {
    return settings.format
      .replace('{n}', pageNum.toString())
      .replace('{total}', totalPages.toString())
      .replace('{page}', pageNum.toString());
  };

  const getPositionStyle = () => {
    const position = POSITION_OPTIONS.find(p => p.value === settings.position);
    return position?.position || {};
  };

  const handleAddPageNumbers = () => {
    onAddPageNumbers(settings);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Type className="w-5 h-5 mr-2" />
              Page Number Settings
            </h3>

            <div className="space-y-6">
              {/* Position */}
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">
                  Position
                </Label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {POSITION_OPTIONS.map((pos) => (
                    <button
                      key={pos.value}
                      onClick={() => handleSettingChange('position', pos.value)}
                      className={`p-3 rounded-lg border-2 transition-all text-xs text-center ${
                        settings.position === pos.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <Label htmlFor="format" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                  Format
                </Label>
                <Input
                  id="format"
                  value={settings.format}
                  onChange={(e) => handleSettingChange('format', e.target.value)}
                  placeholder="Page {n} of {total}"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Use {'{n}'} for page number, {'{total}'} for total pages
                </p>
              </div>

              {/* Font Family */}
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                  Font Family
                </Label>
                <Select value={settings.fontFamily} onValueChange={(value) => handleSettingChange('fontFamily', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                  Font Size
                </Label>
                <Select value={settings.fontSize.toString()} onValueChange={(value) => handleSettingChange('fontSize', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZES.map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}px
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color */}
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                  Color
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleSettingChange('color', color.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        settings.color === color.value
                          ? 'border-blue-500 scale-110'
                          : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Live Preview ({pages.length} pages)
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Adjust settings to see real-time preview
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden aspect-[3/4] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  {/* Page Content */}
                  <div className="h-full p-4 flex flex-col items-center justify-center">
                    <FileText className="w-8 h-8 text-red-500 mb-2" />
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
                      Page {page.pageNumber}
                    </div>
                  </div>

                  {/* Live Page Number Preview */}
                  <div
                    className="absolute text-xs font-medium pointer-events-none"
                    style={{
                      ...getPositionStyle(),
                      fontFamily: settings.fontFamily,
                      fontSize: `${Math.max(settings.fontSize * 0.6, 8)}px`,
                      color: settings.color,
                      backgroundColor: settings.color === '#000000' || settings.color === '#333333' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.8)',
                      padding: '2px 4px',
                      borderRadius: '2px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {getFormattedPageNumber(page.pageNumber, pages.length)}
                  </div>
                </div>
              ))}
            </div>

            {/* Preview Summary */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Palette className="w-5 h-5 text-blue-500 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                    Page Number Preview
                  </h4>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="mb-1">
                      Position: <span className="font-semibold">{POSITION_OPTIONS.find(p => p.value === settings.position)?.label}</span>
                    </p>
                    <p className="mb-1">
                      Format: <span className="font-semibold">{getFormattedPageNumber(1, pages.length)}</span>
                    </p>
                    <p>
                      Style: <span className="font-semibold">{settings.fontFamily}, {settings.fontSize}px</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Page Numbers Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleAddPageNumbers}
          disabled={isProcessing}
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5 mr-2" />
          {isProcessing ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding Page Numbers...
            </span>
          ) : (
            'Add Page Numbers'
          )}
        </Button>
      </div>
    </div>
  );
}
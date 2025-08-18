import { useState } from 'react';
import { FileText, Scissors, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SinglePDFThumbnail } from '@/components/SinglePDFThumbnail';

interface PDFPage {
  id: string;
  pageNumber: number;
}

interface SplitPoint {
  id: string;
  afterPage: number;
}

interface SplitPDFGridProps {
  file: File;
  pages: PDFPage[];
  onSplit: (splitPoints: SplitPoint[]) => void;
  isProcessing: boolean;
}

export function SplitPDFGrid({ file, pages, onSplit, isProcessing }: SplitPDFGridProps) {
  const [splitPoints, setSplitPoints] = useState<SplitPoint[]>([]);
  const [hoveredSeparator, setHoveredSeparator] = useState<number | null>(null);

  const handleSplitHere = (afterPage: number) => {
    const splitPointId = `split-${afterPage}-${Date.now()}`;
    const newSplitPoint: SplitPoint = {
      id: splitPointId,
      afterPage
    };
    
    setSplitPoints(prev => {
      // Check for existing split points
      if (prev.some(sp => sp.afterPage === afterPage)) return prev;
      return [...prev, newSplitPoint].sort((a, b) => a.afterPage - b.afterPage);
    });
  };

  const removeSplitPoint = (afterPage: number) => {
    setSplitPoints(prev => prev.filter(sp => sp.afterPage !== afterPage));
  };

  const getGroupForPage = (pageNumber: number): number => {
    let groupIndex = 0;
    for (const split of splitPoints) {
      if (pageNumber <= split.afterPage) {
        return groupIndex;
      }
      groupIndex++;
    }
    return groupIndex;
  };

  const getGroupPages = () => {
    const groups: PDFPage[][] = [];
    let currentGroup: PDFPage[] = [];
    
    for (const page of pages) {
      currentGroup.push(page);
      
      // Check if there's a split point after this page
      const hasSplit = splitPoints.some(sp => sp.afterPage === page.pageNumber);
      if (hasSplit) {
        groups.push(currentGroup);
        currentGroup = [];
      }
    }
    
    // Add the last group if it has pages
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    
    return groups;
  };

  const groups = getGroupPages();

  return (
    <div className="space-y-6">
      {/* Split Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            PDF Pages ({pages.length})
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Hover between pages to add split points
          </div>
        </div>

        <div className="space-y-6">
          {pages.map((page, index) => (
            <div key={page.id}>
              {/* Page Thumbnail */}
              <div className={`relative bg-gray-100 dark:bg-gray-700 rounded-xl p-4 border-2 ${
                groups.length > 1 ? `border-${['blue', 'green', 'purple', 'orange', 'pink'][getGroupForPage(page.pageNumber)] || 'gray'}-300` : 'border-gray-300'
              } dark:border-gray-600`}>
                
                {/* Group Label */}
                {index === 0 || (splitPoints.some(sp => sp.afterPage === page.pageNumber - 1)) ? (
                  <div className={`absolute -top-3 left-4 px-3 py-1 text-xs font-semibold rounded-full ${
                    groups.length > 1 
                      ? `bg-${['blue', 'green', 'purple', 'orange', 'pink'][getGroupForPage(page.pageNumber)] || 'gray'}-500 text-white`
                      : 'bg-gray-500 text-white'
                  }`}>
                    PDF {getGroupForPage(page.pageNumber) + 1}
                  </div>
                ) : null}

                <div className="flex items-center">
                  <div className="w-20 h-28 mr-4 relative">
                    <SinglePDFThumbnail 
                      file={file} 
                      pageNumber={page.pageNumber}
                      className="w-full h-full rounded border border-gray-300 dark:border-gray-600"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {page.pageNumber}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">Page {page.pageNumber}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">From {file.name}</p>
                  </div>
                </div>
              </div>

              {/* Split Line Area - Clickable zone between pages */}
              {index < pages.length - 1 && (
                <div className="relative flex items-center justify-center py-4">
                  <div 
                    className="group flex items-center justify-center w-full h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 cursor-pointer"
                    onClick={() => handleSplitHere(page.pageNumber)}
                  >
                    {/* Horizontal line */}
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-colors"></div>
                    
                    {/* Split button */}
                    <div className={`mx-4 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      splitPoints.some(sp => sp.afterPage === page.pageNumber)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 group-hover:bg-blue-500 group-hover:text-white'
                    }`}>
                      {splitPoints.some(sp => sp.afterPage === page.pageNumber) ? 'Split Here ✓' : 'Split Here'}
                    </div>
                    
                    {/* Horizontal line */}
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-colors"></div>
                  </div>
                </div>
              )}

              {/* Split Separator Area */}
              {index < pages.length - 1 && (
                <div 
                  className="relative h-8 flex items-center justify-center"
                  onMouseEnter={() => setHoveredSeparator(page.pageNumber)}
                  onMouseLeave={() => setHoveredSeparator(null)}
                >
                  {splitPoints.some(sp => sp.afterPage === page.pageNumber) ? (
                    // Active split point
                    <button
                      onClick={() => removeSplitPoint(page.pageNumber)}
                      className="group flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <Scissors className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Split Applied</span>
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs">(Click to remove)</span>
                    </button>
                  ) : (
                    // Hover split option
                    <div className={`transition-all duration-200 ${
                      hoveredSeparator === page.pageNumber ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}>
                      <button
                        onClick={() => handleSplitHere(page.pageNumber)}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
                      >
                        <Scissors className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Split Here</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Always visible separator line */}
                  <div className="absolute inset-x-0 top-1/2 h-px bg-gray-300 dark:bg-gray-600 -z-10"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Split Summary */}
        {splitPoints.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Split Summary</h4>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="mb-1">Your PDF will be split into <strong>{groups.length} separate files</strong>:</p>
              {groups.map((group, index) => (
                <p key={index}>
                  • PDF {index + 1}: Pages {group[0]?.pageNumber}-{group[group.length - 1]?.pageNumber} ({group.length} pages)
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Split Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => onSplit(splitPoints)}
          disabled={splitPoints.length === 0 || isProcessing}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5 mr-2" />
          {isProcessing ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Splitting PDF...
            </span>
          ) : (
            `Split into ${groups.length} PDF${groups.length === 1 ? '' : 's'}`
          )}
        </Button>
      </div>

      {splitPoints.length === 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hover between pages and click "Split Here" to add split points
          </p>
        </div>
      )}
    </div>
  );
}
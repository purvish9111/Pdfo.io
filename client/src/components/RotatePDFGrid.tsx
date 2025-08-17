import { useState, useEffect } from 'react';
import { FileText, Download, RotateCw, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SinglePDFThumbnail } from '@/components/SinglePDFThumbnail';

interface PDFPage {
  id: string;
  pageNumber: number;
  rotation: number;
}

interface RotatePDFGridProps {
  file: File;
  pages: PDFPage[];
  onRotate: (updatedPages: PDFPage[]) => void;
  isProcessing: boolean;
}

export function RotatePDFGrid({ file, pages, onRotate, isProcessing }: RotatePDFGridProps) {
  const [currentPages, setCurrentPages] = useState<PDFPage[]>([]);

  // Update currentPages when pages prop changes
  useEffect(() => {
    console.log('🔄 RotatePDFGrid: Pages prop changed:', pages.length);
    if (pages.length > 0) {
      setCurrentPages(pages);
      console.log('✅ RotatePDFGrid: Current pages updated:', pages.length);
    }
  }, [pages]);

  const rotatePage = (pageId: string, degrees: number) => {
    const updatedPages = currentPages.map(page =>
      page.id === pageId 
        ? { ...page, rotation: (page.rotation + degrees) % 360 }
        : page
    );
    setCurrentPages(updatedPages);
  };

  const rotateAllPages = (degrees: number) => {
    const updatedPages = currentPages.map(page => ({
      ...page,
      rotation: (page.rotation + degrees) % 360
    }));
    setCurrentPages(updatedPages);
  };

  const resetRotations = () => {
    const resetPages = currentPages.map(page => ({ ...page, rotation: 0 }));
    setCurrentPages(resetPages);
  };

  const hasChanges = currentPages.some(page => page.rotation !== 0);

  const handleApplyRotation = () => {
    onRotate(currentPages);
  };

  const getRotationStyle = (rotation: number) => ({
    transform: `rotate(${rotation}deg)`,
    transition: 'transform 0.3s ease',
  });

  return (
    <div className="space-y-6">
      {/* Rotation Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            PDF Pages ({currentPages.length})
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Click rotation buttons to rotate pages
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => rotateAllPages(90)}
                variant="outline"
                size="sm"
                className="text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <RotateCw className="w-4 h-4 mr-1" />
                Rotate All 90°
              </Button>
              <Button
                onClick={() => rotateAllPages(-90)}
                variant="outline"
                size="sm"
                className="text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Rotate All -90°
              </Button>
              {hasChanges && (
                <Button
                  onClick={resetRotations}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 dark:text-gray-300"
                >
                  Reset All
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {currentPages.map((page, index) => (
            <div
              key={page.id}
              className="group relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              {/* Rotation Controls */}
              <div className="absolute top-2 left-2 right-2 flex justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => rotatePage(page.id, -90)}
                  className="w-7 h-7 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  title="Rotate -90°"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
                <button
                  onClick={() => rotatePage(page.id, 90)}
                  className="w-7 h-7 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-3 h-3" />
                </button>
              </div>

              {/* Page Number Badge */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                {page.pageNumber}
              </div>

              {/* Rotation Indicator */}
              {page.rotation !== 0 && (
                <div className="absolute bottom-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                  {page.rotation}°
                </div>
              )}

              {/* Page Content with Rotation */}
              <div className="aspect-[3/4] p-2">
                <div style={getRotationStyle(page.rotation)} className="w-full h-full">
                  <SinglePDFThumbnail 
                    file={file} 
                    pageNumber={page.pageNumber}
                    className="w-full h-full rounded border border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Rotation Overlay Effect */}
              {page.rotation !== 0 && (
                <div className="absolute inset-0 bg-orange-500/10 pointer-events-none" />
              )}
            </div>
          ))}
        </div>

        {/* Rotation Summary */}
        {hasChanges && (
          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <h4 className="text-sm font-medium text-orange-900 dark:text-orange-200 mb-2">Rotation Summary</h4>
            <div className="text-sm text-orange-700 dark:text-orange-300">
              <p className="mb-1">The following pages have been rotated:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {currentPages
                  .filter(page => page.rotation !== 0)
                  .map(page => (
                    <div key={page.id} className="text-xs">
                      Page {page.pageNumber}: {page.rotation}°
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apply Rotation Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleApplyRotation}
          disabled={!hasChanges || isProcessing}
          size="lg"
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5 mr-2" />
          {isProcessing ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Applying Rotation...
            </span>
          ) : (
            'Apply Rotation'
          )}
        </Button>
      </div>

      {!hasChanges && (
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click the rotation buttons on page thumbnails to rotate pages
          </p>
        </div>
      )}
    </div>
  );
}
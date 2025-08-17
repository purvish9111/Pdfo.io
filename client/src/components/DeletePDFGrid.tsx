import { useState } from 'react';
import { FileText, Download, X, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SinglePDFThumbnail } from '@/components/SinglePDFThumbnail';

interface PDFPage {
  id: string;
  pageNumber: number;
  deleted: boolean;
}

interface DeletePDFGridProps {
  file: File;
  pages: PDFPage[];
  onDelete: (updatedPages: PDFPage[]) => void;
  isProcessing: boolean;
}

export function DeletePDFGrid({ file, pages, onDelete, isProcessing }: DeletePDFGridProps) {
  const [currentPages, setCurrentPages] = useState<PDFPage[]>(pages);

  const togglePageDeletion = (pageId: string) => {
    const updatedPages = currentPages.map(page =>
      page.id === pageId ? { ...page, deleted: !page.deleted } : page
    );
    setCurrentPages(updatedPages);
  };

  const deleteAllPages = () => {
    const updatedPages = currentPages.map(page => ({ ...page, deleted: true }));
    setCurrentPages(updatedPages);
  };

  const restoreAllPages = () => {
    const updatedPages = currentPages.map(page => ({ ...page, deleted: false }));
    setCurrentPages(updatedPages);
  };

  const deletedCount = currentPages.filter(p => p.deleted).length;
  const remainingCount = currentPages.filter(p => !p.deleted).length;
  const hasChanges = currentPages.some(p => p.deleted);

  const handleApplyDeletions = () => {
    onDelete(currentPages);
  };

  return (
    <div className="space-y-6">
      {/* Delete Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            PDF Pages ({pages.length})
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Click X to mark pages for deletion
            </div>
            <div className="flex gap-2">
              {remainingCount > 0 && (
                <Button
                  onClick={deleteAllPages}
                  variant="outline"
                  size="sm"
                  className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Delete All
                </Button>
              )}
              {deletedCount > 0 && (
                <Button
                  onClick={restoreAllPages}
                  variant="outline"
                  size="sm"
                  className="text-green-600 dark:text-green-400 border-green-300 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Restore All
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {currentPages.map((page, index) => (
            <div
              key={page.id}
              className={`group relative rounded-xl overflow-hidden transition-all duration-300 ${
                page.deleted
                  ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-600 opacity-50 scale-95'
                  : 'bg-gray-100 dark:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:scale-105 hover:shadow-lg'
              }`}
            >
              {/* Delete Button */}
              <button
                onClick={() => togglePageDeletion(page.id)}
                className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                  page.deleted
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100'
                }`}
              >
                {page.deleted ? (
                  <RotateCcw className="w-3 h-3" />
                ) : (
                  <X className="w-3 h-3" />
                )}
              </button>

              {/* Page Number Badge */}
              <div className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full font-semibold ${
                page.deleted
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}>
                {page.pageNumber}
              </div>

              {/* Deletion Overlay */}
              {page.deleted && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                    DELETED
                  </div>
                </div>
              )}

              {/* Page Content */}
              <div className="aspect-[3/4] p-2">
                <SinglePDFThumbnail 
                  file={file} 
                  pageNumber={page.pageNumber}
                  className="w-full h-full rounded border border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Deletion Summary */}
        {hasChanges && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-500 mt-0.5" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-900 dark:text-red-200 mb-1">
                  Deletion Summary
                </h4>
                <div className="text-sm text-red-700 dark:text-red-300">
                  <p className="mb-1">
                    <span className="font-semibold">{deletedCount}</span> page{deletedCount !== 1 ? 's' : ''} marked for deletion
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">{remainingCount}</span> page{remainingCount !== 1 ? 's' : ''} will remain
                  </p>
                  {remainingCount === 0 && (
                    <p className="text-red-800 dark:text-red-200 font-semibold">
                      ⚠️ Cannot create PDF with no pages. Please keep at least one page.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Pages Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleApplyDeletions}
          disabled={!hasChanges || remainingCount === 0 || isProcessing}
          size="lg"
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5 mr-2" />
          {isProcessing ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Deleting Pages...
            </span>
          ) : (
            `Delete ${deletedCount} Page${deletedCount !== 1 ? 's' : ''}`
          )}
        </Button>
      </div>

      {!hasChanges && (
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click the X icon on page thumbnails to mark them for deletion
          </p>
        </div>
      )}

      {remainingCount === 0 && deletedCount > 0 && (
        <div className="text-center">
          <p className="text-sm text-red-500 dark:text-red-400">
            Please keep at least one page to create a valid PDF document
          </p>
        </div>
      )}
    </div>
  );
}
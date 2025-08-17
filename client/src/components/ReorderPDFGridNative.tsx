import { useState } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, GripVertical } from 'lucide-react';
import { SinglePDFThumbnail } from './SinglePDFThumbnail';

interface PDFPage {
  id: string;
  pageNumber: number;
  originalIndex: number;
}

interface ReorderPDFGridProps {
  file: File;
  pages: PDFPage[];
  onReorder: (reorderedPages: PDFPage[]) => void;
  isProcessing: boolean;
}

interface SortablePageProps {
  page: PDFPage;
  index: number;
  file: File;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  isDraggedOver: boolean;
}

function SortablePage({ 
  page, 
  index, 
  file, 
  onDragStart, 
  onDragOver, 
  onDrop, 
  onDragEnd,
  isDraggedOver
}: SortablePageProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    console.log('🚀 Native drag start:', page.id, 'index:', index);
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(index);
  };

  const handleDragEnd = () => {
    console.log('🎯 Native drag end:', page.id);
    setIsDragging(false);
    onDragEnd();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver(e, index);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    console.log('📍 Native drop on:', page.id, 'index:', index);
    onDrop(e, index);
  };

  return (
    <div
      className={`group relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden transition-all duration-300 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${
        isDraggedOver ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'hover:shadow-lg hover:scale-105'
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag Handle */}
      <div 
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 dark:bg-gray-600 text-white rounded p-2 cursor-grab active:cursor-grabbing z-10"
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Page Number Badge */}
      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
        {page.pageNumber}
      </div>

      {/* Original Position Indicator */}
      {page.originalIndex !== index && (
        <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
          was #{page.originalIndex + 1}
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

      {/* Drag Overlay Effect */}
      <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
}

export function ReorderPDFGridNative({ file, pages, onReorder, isProcessing }: ReorderPDFGridProps) {
  const [currentPages, setCurrentPages] = useState<PDFPage[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  // Update currentPages when pages prop changes
  React.useEffect(() => {
    console.log('🔄 ReorderPDFGridNative: Pages prop changed:', pages.length);
    if (pages.length > 0) {
      const pagesWithOriginalIndex = pages.map((page, index) => ({ 
        ...page, 
        originalIndex: index 
      }));
      setCurrentPages(pagesWithOriginalIndex);
      console.log('✅ ReorderPDFGridNative: Current pages updated:', pagesWithOriginalIndex.length);
    }
  }, [pages]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    setDraggedOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (index !== draggedIndex) {
      setDraggedOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    console.log('📋 Native reorder:', { dragIndex, dropIndex, pagesLength: currentPages.length });
    
    if (dragIndex !== dropIndex && dragIndex >= 0 && dropIndex >= 0) {
      setCurrentPages(prevPages => {
        const newPages = [...prevPages];
        const draggedPage = newPages[dragIndex];
        
        // Remove the dragged page
        newPages.splice(dragIndex, 1);
        // Insert it at the new position
        newPages.splice(dropIndex, 0, draggedPage);
        
        console.log('✅ Native pages reordered:', newPages.map(p => p.pageNumber));
        return newPages;
      });
    }
    
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  };

  const hasChanges = currentPages.some((page, index) => page.originalIndex !== index);

  const handleApplyChanges = () => {
    onReorder(currentPages);
  };

  const resetOrder = () => {
    setCurrentPages(pages.map((page, index) => ({ ...page, originalIndex: index })));
  };

  return (
    <div className="space-y-6">
      {/* Reorder Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            PDF Pages ({currentPages.length})
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Drag to reorder pages
            </div>
            {hasChanges && (
              <Button
                onClick={resetOrder}
                variant="outline"
                size="sm"
                className="text-gray-600 dark:text-gray-300"
              >
                Reset Order
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {currentPages.map((page, index) => (
            <SortablePage
              key={page.id}
              page={page}
              index={index}
              file={file}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              isDraggedOver={draggedOverIndex === index}
            />
          ))}
        </div>

        {/* Changes Summary */}
        {hasChanges && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Page Order Changes</h4>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="mb-2">The following pages have been reordered:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentPages.map((page, newIndex) => {
                  if (page.originalIndex !== newIndex) {
                    return (
                      <div key={page.id} className="flex items-center text-xs">
                        <span>Page {page.pageNumber}: Position {page.originalIndex + 1} → {newIndex + 1}</span>
                      </div>
                    );
                  }
                  return null;
                }).filter(Boolean)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apply Changes Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleApplyChanges}
          disabled={!hasChanges || isProcessing}
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5 mr-2" />
          {isProcessing ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Applying Changes...
            </span>
          ) : (
            'Apply Page Order'
          )}
        </Button>
      </div>

      {!hasChanges && (
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag and drop page thumbnails to change their order
          </p>
        </div>
      )}
    </div>
  );
}
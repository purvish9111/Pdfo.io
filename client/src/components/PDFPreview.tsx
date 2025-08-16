import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RotateCw, Trash2, Download, Coffee, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFPage {
  id: string;
  pageNumber: number;
  rotation: number;
  deleted: boolean;
}

interface PDFPreviewProps {
  file: File;
  pages: PDFPage[];
  onPagesChange: (pages: PDFPage[]) => void;
  onDownload: () => void;
  onNewUpload: () => void;
  toolType: 'merge' | 'split' | 'reorder' | 'delete' | 'rotate' | 'pagenumbers';
}

function SortablePageItem({ 
  page, 
  onRotate, 
  onDelete, 
  toolType 
}: { 
  page: PDFPage; 
  onRotate: (id: string) => void; 
  onDelete: (id: string) => void;
  toolType: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (page.deleted) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group cursor-pointer border-2 border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:border-pdfo-blue dark:hover:border-pdfo-blue transition-colors page-thumbnail ${
        toolType === 'reorder' ? 'cursor-grab' : ''
      }`}
      {...(toolType === 'reorder' ? { ...attributes, ...listeners } : {})}
    >
      {/* Mock PDF page thumbnail */}
      <div 
        className="aspect-[3/4] bg-white dark:bg-gray-100 flex items-center justify-center"
        style={{ transform: `rotate(${page.rotation}deg)` }}
      >
        <div className="text-center">
          <i className="fas fa-file-pdf text-red-500 text-2xl mb-2"></i>
          <p className="text-xs text-gray-500">Page {page.pageNumber}</p>
        </div>
      </div>
      
      {/* Page Controls */}
      {(toolType === 'rotate' || toolType === 'delete' || toolType === 'reorder') && (
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          {(toolType === 'rotate' || toolType === 'reorder') && (
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full w-8 h-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onRotate(page.id);
              }}
              title="Rotate"
            >
              <RotateCw className="h-3 w-3" />
            </Button>
          )}
          {(toolType === 'delete' || toolType === 'reorder') && (
            <Button
              size="sm"
              variant="destructive"
              className="rounded-full w-8 h-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(page.id);
              }}
              title="Delete"
            >
              <Trash2 className="h-3 w-3 text-white" />
            </Button>
          )}
        </div>
      )}
      
      {/* Page Number */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
        {page.pageNumber}
      </div>
    </div>
  );
}

export function PDFPreview({ file, pages, onPagesChange, onDownload, onNewUpload, toolType }: PDFPreviewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = pages.findIndex((page) => page.id === active.id);
      const newIndex = pages.findIndex((page) => page.id === over.id);
      
      onPagesChange(arrayMove(pages, oldIndex, newIndex));
    }
  };

  const handleRotate = (id: string) => {
    const updatedPages = pages.map((page) =>
      page.id === id ? { ...page, rotation: (page.rotation + 90) % 360 } : page
    );
    onPagesChange(updatedPages);
  };

  const handleDelete = (id: string) => {
    const updatedPages = pages.map((page) =>
      page.id === id ? { ...page, deleted: true } : page
    );
    onPagesChange(updatedPages);
  };

  const visiblePages = pages.filter(page => !page.deleted);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">PDF Preview</h3>
      
      {/* File Info */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-file-pdf text-red-500 text-xl mr-3"></i>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {visiblePages.length} pages • {(file.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Thumbnails */}
      <div className="mb-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={visiblePages.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {visiblePages.map((page) => (
                <SortablePageItem
                  key={page.id}
                  page={page}
                  onRotate={handleRotate}
                  onDelete={handleDelete}
                  toolType={toolType}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        
        {visiblePages.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            All pages have been deleted. Upload a new file to continue.
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={onDownload} 
          disabled={visiblePages.length === 0}
          className="bg-pdfo-blue text-white hover:bg-blue-600 flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Processed PDF
        </Button>
        <Button 
          variant="outline" 
          onClick={onNewUpload}
          className="flex items-center"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload New File
        </Button>
      </div>

      {/* Donation Button (appears after processing) */}
      <div className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 mb-3">Did PDFo help you? Consider supporting us!</p>
        <Button asChild className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
          <a 
            href="https://buymeacoffee.com/pravaah" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <Coffee className="mr-2 h-4 w-4" />
            Buy me a coffee
          </a>
        </Button>
      </div>
    </div>
  );
}

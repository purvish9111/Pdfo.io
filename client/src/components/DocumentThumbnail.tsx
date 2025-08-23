import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, FileText, GripVertical } from 'lucide-react';
import { SimplePDFPreview } from '@/components/SimplePDFPreview';

interface PDFPageInfo {
  id: string;
  pageNumber: number;
  documentId: string;
  thumbnail?: string;
}

interface DocumentThumbnailProps {
  id: string;
  file: File;
  pages: PDFPageInfo[];
  expanded: boolean;
  onToggleExpanded: () => void;
  formatFileSize: (bytes: number) => string;
}

export function DocumentThumbnail({
  id,
  file,
  pages,
  expanded,
  onToggleExpanded,
  formatFileSize
}: DocumentThumbnailProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    data: {
      type: 'document',
      document: { id, file }
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden transition-all duration-300 ${
        isDragging ? 'shadow-2xl ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 z-50' : 'hover:border-gray-300 dark:hover:border-gray-500'
      }`}
    >
      {/* Document Header */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center flex-1 min-w-0">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded cursor-grab active:cursor-grabbing mr-3 touch-none"
            style={{ touchAction: 'none' }}
          >
            <GripVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>

          {/* Document Icon and Preview */}
          <div className="flex-shrink-0 mr-4">
            <div className="w-20 h-24 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-8 h-8 text-red-500" />
              </div>
              <SimplePDFPreview 
                file={file} 
                className="w-full h-full absolute inset-0"
                onError={() => {
                  // Will show fallback icon when PDF fails to load
                }}
              />
              {/* PDF badge */}
              <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-xs text-center py-1">
                PDF
              </div>
            </div>
          </div>

          {/* Document Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate mr-2">
                {file.name}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                {pages.length} {pages.length === 1 ? 'page' : 'pages'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(file.size)}
            </p>
          </div>

          {/* Expand Button */}
          <button
            onClick={onToggleExpanded}
            className="flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Pages View */}
      {expanded && (
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
          <div className="mb-3">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Individual Pages ({pages.length})
            </h5>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Drag pages to reorder them within this document
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pages.map((page, index) => (
              <div
                key={page.id}
                className="group/page relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden aspect-[3/4] border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600 cursor-move transition-all duration-200"
              >
                {/* Page Preview Placeholder - simplified for now */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                  <FileText className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">{page.pageNumber}</span>
                </div>
                
                {/* Drag Indicator */}
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover/page:opacity-100 transition-opacity duration-200" />
                
                {/* Page Number Badge */}
                <div className="absolute top-2 left-2 bg-gray-800 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded shadow">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Pages Management Hint */}
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 <strong>Pro tip:</strong> You can drag individual pages to reorder them, or drag the entire document using the grip handle at the top.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
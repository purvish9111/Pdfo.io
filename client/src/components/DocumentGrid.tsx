import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { DocumentThumbnail } from '@/components/DocumentThumbnail';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DocumentInfo {
  id: string;
  file: File;
  pages: PDFPageInfo[];
  expanded: boolean;
}

interface PDFPageInfo {
  id: string;
  pageNumber: number;
  documentId: string;
  thumbnail?: string;
}

interface DocumentGridProps {
  files: File[];
  onFilesReorder: (reorderedFiles: File[]) => void;
  onMerge: () => void;
  isProcessing: boolean;
}

export function DocumentGrid({ files, onFilesReorder, onMerge, isProcessing }: DocumentGridProps) {
  const [documents, setDocuments] = useState<DocumentInfo[]>(() =>
    files.map((file, index) => ({
      id: `doc-${index}-${Date.now()}`,
      file,
      pages: Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, pageIndex) => ({
        id: `page-${index}-${pageIndex}-${Date.now()}`,
        pageNumber: pageIndex + 1,
        documentId: `doc-${index}-${Date.now()}`,
      })),
      expanded: false,
    }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setDocuments((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        const reorderedFiles = reorderedItems.map(item => item.file);
        onFilesReorder(reorderedFiles);
        
        return reorderedItems;
      });
    }
  };

  const toggleExpanded = (documentId: string) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === documentId 
          ? { ...doc, expanded: !doc.expanded }
          : doc
      )
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Document Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Uploaded Documents ({documents.length})
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Drag to reorder • Click to expand pages
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={documents.map(doc => doc.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {documents.map((document) => (
                <DocumentThumbnail
                  key={document.id}
                  id={document.id}
                  file={document.file}
                  pages={document.pages}
                  expanded={document.expanded}
                  onToggleExpanded={() => toggleExpanded(document.id)}
                  formatFileSize={formatFileSize}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Merge Information */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">ℹ</span>
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                Merge Preview
              </h4>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="mb-1">
                  Total documents: <span className="font-semibold">{documents.length}</span>
                </p>
                <p className="mb-1">
                  Total pages: <span className="font-semibold">
                    {documents.reduce((total, doc) => total + doc.pages.length, 0)}
                  </span>
                </p>
                <p>
                  Output size: <span className="font-semibold">
                    {formatFileSize(documents.reduce((total, doc) => total + doc.file.size, 0))}
                  </span> (estimated)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Merge Button */}
      <div className="flex justify-center">
        <Button
          onClick={onMerge}
          disabled={documents.length < 2 || isProcessing}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5 mr-2" />
          {isProcessing ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Merging PDFs...
            </span>
          ) : (
            `Merge ${documents.length} PDF${documents.length === 1 ? '' : 's'}`
          )}
        </Button>
      </div>

      {documents.length < 2 && (
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload at least 2 PDF files to enable merging
          </p>
        </div>
      )}
    </div>
  );
}
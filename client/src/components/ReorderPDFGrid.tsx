import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileText, Download, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SinglePDFThumbnail } from '@/components/SinglePDFThumbnail';

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
}

function SortablePage({ page, index, file }: SortablePageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: page.id,
    data: {
      type: 'page',
      page,
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
      className={`group relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden transition-all duration-300 cursor-move ${
        isDragging ? 'shadow-2xl ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 z-50' : 'hover:shadow-lg hover:scale-105'
      }`}
      {...attributes}
      {...listeners}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 dark:bg-gray-600 text-white rounded p-1">
        <GripVertical className="w-3 h-3" />
      </div>

      {/* Page Number Badge */}
      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
        {index + 1}
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

export function ReorderPDFGrid({ file, pages, onReorder, isProcessing }: ReorderPDFGridProps) {
  const [currentPages, setCurrentPages] = useState<PDFPage[]>(() => 
    pages.map((page, index) => ({ ...page, originalIndex: index }))
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      setCurrentPages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const hasChanges = currentPages.some((page, index) => page.originalIndex !== index);

  const handleApplyChanges = () => {
    onReorder(currentPages);
  };

  const resetOrder = () => {
    setCurrentPages(pages.map((page, index) => ({ ...page, originalIndex: index })));
  };

  const activeItem = currentPages.find((page) => page.id === activeId);

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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={currentPages.map(page => page.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {currentPages.map((page, index) => (
                <SortablePage
                  key={page.id}
                  page={page}
                  index={index}
                  file={file}
                />
              ))}
            </div>
          </SortableContext>
          
          <DragOverlay>
            {activeItem ? (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden shadow-2xl ring-2 ring-blue-500">
                <div className="aspect-[3/4] p-4 flex flex-col items-center justify-center">
                  <FileText className="w-8 h-8 text-red-500 mb-2" />
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
                    Page {activeItem.pageNumber}
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

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
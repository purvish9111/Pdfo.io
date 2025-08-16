import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SinglePDFThumbnail } from "@/components/SinglePDFThumbnail";
import { FileText, Trash2, RotateCcw, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FilesPreviewWithThumbnailsProps {
  files: File[];
  onFilesChange?: (files: File[]) => void;
  showThumbnails?: boolean;
  title?: string;
  children?: React.ReactNode;
  allowReorder?: boolean;
}

// Sortable File Card Component
interface SortableFileCardProps {
  id: string;
  file: File;
  index: number;
  onRemove: (index: number) => void;
  showThumbnails: boolean;
}

function SortableFileCard({
  id,
  file,
  index,
  onRemove,
  showThumbnails,
}: SortableFileCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`relative group cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 p-1 rounded bg-gray-200 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-20"
      >
        <GripVertical className="h-3 w-3 text-gray-600 dark:text-gray-400" />
      </div>
      
      {/* File Order Number */}
      <div className="absolute -top-2 -left-2 h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
        {index + 1}
      </div>
      
      {/* Remove button */}
      <Button
        variant="destructive"
        size="sm"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={() => onRemove(index)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
      
      {/* File Preview */}
      <div className="p-3">
        {showThumbnails ? (
          <SinglePDFThumbnail file={file} />
        ) : (
          <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-3">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* File Info */}
        <div className="mt-3 space-y-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      </div>
    </Card>
  );
}

export function FilesPreviewWithThumbnails({
  files,
  onFilesChange,
  showThumbnails = true,
  title = "Selected Files",
  children,
  allowReorder = false,
}: FilesPreviewWithThumbnailsProps) {
  if (files.length === 0) return null;

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    onFilesChange?.(updatedFiles);
  };

  const clearAllFiles = () => {
    onFilesChange?.([]);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = files.findIndex((file, index) => `file-${index}` === active.id);
      const newIndex = files.findIndex((file, index) => `file-${index}` === over.id);
      
      const reorderedFiles = arrayMove(files, oldIndex, newIndex);
      onFilesChange?.(reorderedFiles);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <Badge variant="secondary">
            {files.length} file{files.length !== 1 ? 's' : ''}
          </Badge>
          {allowReorder && (
            <Badge variant="outline" className="text-xs">
              Drag to reorder
            </Badge>
          )}
        </div>
        
        {onFilesChange && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFiles}
            className="text-red-600 hover:text-red-700 dark:text-red-400"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Files Grid */}
      {allowReorder && onFilesChange ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={files.map((_, index) => `file-${index}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <SortableFileCard
                  key={`file-${index}`}
                  id={`file-${index}`}
                  file={file}
                  index={index}
                  onRemove={removeFile}
                  showThumbnails={showThumbnails}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <Card key={`${file.name}-${index}`} className="relative group">
              {/* File Order Number */}
              <div className="absolute -top-2 -left-2 h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                {index + 1}
              </div>
              
              {/* Remove button */}
              {onFilesChange && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={() => removeFile(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
              
              {/* File Preview */}
              <div className="p-3">
                {showThumbnails ? (
                  <SinglePDFThumbnail file={file} />
                ) : (
                  <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-3">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                {/* File Info */}
                <div className="mt-3 space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {children && (
        <div className="flex justify-center pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
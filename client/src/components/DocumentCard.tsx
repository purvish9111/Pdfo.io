import React, { useState } from "react";
import { X, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SinglePDFThumbnail } from "@/components/SinglePDFThumbnail";

interface DocumentCardProps {
  file: File;
  onRemove: () => void;
  showPages?: boolean;
  allowPageReorder?: boolean;
  onPageReorder?: (pageOrder: number[]) => void;
  dragListeners?: any;
}

export function DocumentCard({ 
  file, 
  onRemove, 
  showPages = true, 
  allowPageReorder = false,
  onPageReorder,
  dragListeners
}: DocumentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Drag Handle */}
        <div 
          className="flex-shrink-0 cursor-move text-gray-400 hover:text-gray-600 touch-none"
          {...dragListeners}
        >
          <GripVertical className="h-5 w-5" />
        </div>
        
        {/* PDF Preview Thumbnail */}
        <div className="flex-shrink-0">
          <SinglePDFThumbnail 
            file={file} 
            className="w-16 h-20 rounded border border-gray-200 dark:border-gray-600"
          />
        </div>
        
        {/* File Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={file.name}>
                {file.name}
              </p>
              <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <span>{formatFileSize(file.size)}</span>
                <span>PDF Document</span>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-2">
              {showPages && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="text-xs mr-1">Show Pages</span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded Page Thumbnails */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Page thumbnails will be available in a future update
          </p>
        </div>
      )}
    </div>
  );
}
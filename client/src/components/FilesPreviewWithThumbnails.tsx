import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PDFThumbnailPreview } from "@/components/PDFThumbnailPreview";
import { FileText, Trash2, RotateCcw } from "lucide-react";

interface FilesPreviewWithThumbnailsProps {
  files: File[];
  onFilesChange?: (files: File[]) => void;
  showThumbnails?: boolean;
  title?: string;
  children?: React.ReactNode;
}

export function FilesPreviewWithThumbnails({
  files,
  onFilesChange,
  showThumbnails = true,
  title = "Selected Files",
  children,
}: FilesPreviewWithThumbnailsProps) {
  if (files.length === 0) return null;

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    onFilesChange?.(updatedFiles);
  };

  const clearAllFiles = () => {
    onFilesChange?.([]);
  };

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

      {/* Thumbnail Preview */}
      {showThumbnails && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <PDFThumbnailPreview files={files} />
        </div>
      )}

      {/* Simple File List (fallback) */}
      {!showThumbnails && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <Card key={`${file.name}-${index}`} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
                
                {onFilesChange && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
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
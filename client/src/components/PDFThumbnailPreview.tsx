import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMultiplePDFThumbnails, PDFThumbnail } from "@/lib/pdfThumbnails";
import { generateSimplePDFThumbnails, SimplePDFThumbnail } from "@/lib/simplePdfPreview";
import { FileText, AlertCircle, Image } from "lucide-react";

interface PDFThumbnailPreviewProps {
  files: File[];
  onThumbnailsGenerated?: (thumbnails: PDFThumbnail[]) => void;
}

export function PDFThumbnailPreview({ files, onThumbnailsGenerated }: PDFThumbnailPreviewProps) {
  const [thumbnails, setThumbnails] = useState<PDFThumbnail[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [useSimplePreview, setUseSimplePreview] = useState(false);

  useEffect(() => {
    if (files.length === 0) {
      setThumbnails([]);
      return;
    }

    const generateThumbnails = async () => {
      setLoading(true);
      setProgress({ completed: 0, total: files.length });

      try {
        // Try PDF.js first
        const generatedThumbnails = await generateMultiplePDFThumbnails(
          files,
          (completed, total) => setProgress({ completed, total })
        );

        // Check if any thumbnails failed due to worker issues
        const hasWorkerErrors = generatedThumbnails.some(t => 
          t.error && t.error.includes('GlobalWorkerOptions')
        );

        if (hasWorkerErrors) {
          // Fall back to simple preview
          setUseSimplePreview(true);
          const simpleThumbnails = await generateSimplePDFThumbnails(
            files,
            (completed, total) => setProgress({ completed, total })
          );
          
          // Convert to PDFThumbnail format
          const convertedThumbnails = simpleThumbnails.map(t => ({
            file: t.file,
            thumbnailUrl: t.thumbnailUrl,
            pageCount: t.pageCount,
            error: t.error,
          }));
          
          setThumbnails(convertedThumbnails);
        } else {
          setThumbnails(generatedThumbnails);
        }
      } catch (error) {
        // Complete fallback to simple preview
        setUseSimplePreview(true);
        const simpleThumbnails = await generateSimplePDFThumbnails(
          files,
          (completed, total) => setProgress({ completed, total })
        );
        
        const convertedThumbnails = simpleThumbnails.map(t => ({
          file: t.file,
          thumbnailUrl: t.thumbnailUrl,
          pageCount: t.pageCount,
          error: t.error,
        }));
        
        setThumbnails(convertedThumbnails);
      }

      setLoading(false);
      onThumbnailsGenerated?.(thumbnails);
    };

    generateThumbnails();
  }, [files, onThumbnailsGenerated]);

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {loading && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            {useSimplePreview ? 'Creating file previews...' : 'Generating PDF previews...'}
          </div>
          <div className="text-xs">
            {progress.completed} of {progress.total} files processed
          </div>
        </div>
      )}

      {useSimplePreview && !loading && (
        <div className="text-center text-xs text-amber-600 dark:text-amber-400 mb-3 flex items-center justify-center gap-1">
          <Image className="h-3 w-3" />
          Using simple preview mode
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {thumbnails.map((thumbnail, index) => (
          <ThumbnailCard key={`${thumbnail.file.name}-${index}`} thumbnail={thumbnail} />
        ))}
        
        {/* Loading skeletons for remaining files */}
        {loading &&
          Array.from({ length: files.length - thumbnails.length }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="p-3">
              <Skeleton className="w-full h-32 mb-2 rounded" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </Card>
          ))}
      </div>
    </div>
  );
}

function ThumbnailCard({ thumbnail }: { thumbnail: PDFThumbnail }) {
  const { file, thumbnailUrl, pageCount, error } = thumbnail;

  return (
    <Card className="p-3 hover:shadow-md transition-shadow">
      <div className="aspect-[3/4] mb-3 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
        {error ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-red-500 p-2">
            <AlertCircle className="h-6 w-6 mb-1" />
            <span className="text-xs text-center">Preview Error</span>
            <span className="text-xs text-center text-gray-500 mt-1" title={error}>
              {error.includes('GlobalWorkerOptions') ? 'Loading PDF...' : 'Invalid PDF'}
            </span>
          </div>
        ) : thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`Preview of ${file.name}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-900 dark:text-white truncate" title={file.name}>
          {file.name}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{formatFileSize(file.size)}</span>
          {pageCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {pageCount} page{pageCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        {error && (
          <div className="text-xs text-red-500 truncate" title={error}>
            {error.includes('GlobalWorkerOptions') ? 'Using fallback preview' : error}
          </div>
        )}
      </div>
    </Card>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
import { useEffect, useState } from "react";
import { generatePDFThumbnail, type PDFThumbnail } from "@/lib/pdfThumbnails";
import { FileText, AlertCircle, Image } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SinglePDFThumbnailProps {
  file: File;
  className?: string;
}

export function SinglePDFThumbnail({ file, className = "" }: SinglePDFThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<PDFThumbnail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateThumbnail = async () => {
      setLoading(true);
      try {
        const result = await generatePDFThumbnail(file);
        setThumbnail(result);
      } catch (error) {
        console.error('Thumbnail generation failed:', error);
        setThumbnail({
          file,
          thumbnailUrl: '',
          pageCount: 0,
          error: 'Failed to generate thumbnail'
        });
      } finally {
        setLoading(false);
      }
    };

    generateThumbnail();
  }, [file]);

  if (loading) {
    return (
      <div className={`aspect-[3/4] ${className}`}>
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
    );
  }

  if (thumbnail?.error || !thumbnail?.thumbnailUrl) {
    return (
      <div className={`aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center p-4 ${className}`}>
        <FileText className="h-8 w-8 text-gray-400 mb-2" />
        <div className="text-xs text-gray-500 text-center">
          <div className="font-medium truncate max-w-full">
            {file.name.split('.')[0]}
          </div>
          {thumbnail?.pageCount > 0 && (
            <div className="text-xs text-gray-400 mt-1">
              {thumbnail.pageCount} page{thumbnail.pageCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`aspect-[3/4] relative ${className}`}>
      <img
        src={thumbnail.thumbnailUrl}
        alt={`PDF thumbnail: ${file.name}`}
        className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-700"
        onError={() => setThumbnail(prev => prev ? { ...prev, error: 'Image load failed' } : null)}
      />
      {thumbnail.pageCount > 0 && (
        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
          {thumbnail.pageCount} page{thumbnail.pageCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
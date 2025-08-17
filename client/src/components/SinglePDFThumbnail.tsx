import { useEffect, useState } from "react";
import { generatePDFThumbnail, type PDFThumbnail } from "@/lib/pdfThumbnails";
import { FileText, AlertCircle, Image } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SinglePDFThumbnailProps {
  file: File;
  className?: string;
  pageNumber?: number;
}

export function SinglePDFThumbnail({ file, className = "", pageNumber }: SinglePDFThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<PDFThumbnail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateThumbnail = async () => {
      setLoading(true);
      try {
        console.log('🖼️ SinglePDFThumbnail generating for:', file.name, 'page:', pageNumber);
        const result = await generatePDFThumbnail(file, pageNumber);
        console.log('✅ SinglePDFThumbnail generated successfully:', result.thumbnailUrl ? 'SUCCESS' : 'FAILED');
        setThumbnail(result);
      } catch (error) {
        console.error('❌ SinglePDFThumbnail generation failed:', error);
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
  }, [file, pageNumber]);

  // Removed loading skeleton for instant display
  if (loading) {
    return (
      <div className={`aspect-[2/3] bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center p-2 ${className}`}>
        <FileText className="h-6 w-6 text-gray-400 mb-1" />
        <div className="text-xs text-gray-500 text-center">
          Processing...
        </div>
      </div>
    );
  }

  if (thumbnail?.error || !thumbnail?.thumbnailUrl) {
    return (
      <div className={`aspect-[2/3] bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center p-2 ${className}`}>
        <FileText className="h-6 w-6 text-gray-400 mb-1" />
        <div className="text-xs text-gray-500 text-center">
          {thumbnail && thumbnail.pageCount > 0 && (
            <div className="text-xs text-gray-400">
              {thumbnail.pageCount} page{thumbnail.pageCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`aspect-[2/3] relative ${className}`}>
      <img
        src={thumbnail.thumbnailUrl}
        alt={`PDF thumbnail: ${file.name}`}
        className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-700"
        onError={() => setThumbnail(prev => prev ? { ...prev, error: 'Image load failed' } : null)}
      />
      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
        Page {pageNumber}
      </div>
    </div>
  );
}
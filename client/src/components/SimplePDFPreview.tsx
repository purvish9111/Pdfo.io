import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js to work without external worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '';

interface SimplePDFPreviewProps {
  file: File | null;
  pageNumber?: number;
  className?: string;
  onError?: (error: string) => void;
}

export function SimplePDFPreview({ file, pageNumber = 1, className = "", onError }: SimplePDFPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !canvasRef.current) return;

    const renderPDF = async () => {
      setLoading(true);
      setError(null);

      try {
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        // Get the specified page (or first page if pageNumber is invalid)
        const maxPages = pdf.numPages;
        const targetPage = Math.min(Math.max(1, pageNumber), maxPages);
        const page = await pdf.getPage(targetPage);
        
        // Set up canvas
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;

        // Calculate scale to fit in container with better sizing
        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = Math.max(canvas.parentElement?.offsetWidth || 200, 100);
        const containerHeight = Math.max(canvas.parentElement?.offsetHeight || 250, 120);
        const scale = Math.min((containerWidth - 20) / viewport.width, (containerHeight - 20) / viewport.height);
        const scaledViewport = page.getViewport({ scale: Math.max(scale, 0.1) });

        // Set canvas dimensions
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        // Render the page
        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
          canvas: canvas,
        }).promise;

      } catch (err) {
        console.error('Error rendering PDF:', err);
        const errorMsg = 'PDF preview unavailable';
        setError(errorMsg);
        onError?.(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    renderPDF();
  }, [file, pageNumber, onError]);

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent p-2">
          {/* Error state - let the fallback icon show through */}
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ 
          display: (!loading && !error && file) ? 'block' : 'none',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      />
      
      {!file && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          <div className="text-center">
            <div className="w-8 h-8 text-gray-400 mx-auto mb-1">📄</div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">No PDF</p>
          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use local fallback for better reliability
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
} catch (error) {
  // Fallback to disable worker for better compatibility
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
}

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

        // Calculate scale to fit in container
        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = canvas.offsetWidth || 200;
        const containerHeight = canvas.offsetHeight || 250;
        const scale = Math.min(containerWidth / viewport.width, containerHeight / viewport.height);
        const scaledViewport = page.getViewport({ scale });

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
        const errorMsg = 'Failed to render PDF preview. Please make sure the file is a valid PDF.';
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
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 p-2">
          <div className="text-center">
            <div className="w-8 h-8 text-red-500 mx-auto mb-1">📄</div>
            <p className="text-red-700 dark:text-red-300 text-xs">Failed to load</p>
          </div>
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
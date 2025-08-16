import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface SimplePDFPreviewProps {
  file: File | null;
}

export function SimplePDFPreview({ file }: SimplePDFPreviewProps) {
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
        
        // Get the first page
        const page = await pdf.getPage(1);
        
        // Set up canvas
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;

        // Calculate scale to fit in container
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(400 / viewport.width, 500 / viewport.height);
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
        setError('Failed to render PDF preview. Please make sure the file is a valid PDF.');
      } finally {
        setLoading(false);
      }
    };

    renderPDF();
  }, [file]);

  if (!file) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-8">
        Select a PDF file to see preview
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        PDF Preview
      </h3>
      
      {loading && (
        <div className="flex items-center justify-center w-96 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="text-gray-500 dark:text-gray-400">Loading preview...</div>
        </div>
      )}
      
      {error && (
        <div className="w-96 h-64 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
          <div className="text-red-600 dark:text-red-400 text-sm text-center p-4">
            {error}
          </div>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        className={`max-w-full h-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 ${
          loading || error ? 'hidden' : ''
        }`}
        style={{ maxWidth: '400px', maxHeight: '500px' }}
      />
      
      {file && !loading && !error && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          <p className="font-medium">{file.name}</p>
          <p>First page preview</p>
        </div>
      )}
    </div>
  );
}
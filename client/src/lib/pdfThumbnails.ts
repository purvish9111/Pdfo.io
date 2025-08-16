import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface PDFThumbnail {
  file: File;
  thumbnailUrl: string;
  pageCount: number;
  error?: string;
}

/**
 * Generate thumbnail preview for PDF files using PDF.js
 * This is completely client-side - no server upload required
 */
export async function generatePDFThumbnail(file: File): Promise<PDFThumbnail> {
  try {
    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    
    // Get the first page
    const page = await pdf.getPage(1);
    
    // Calculate scale for thumbnail (max width: 200px)
    const viewport = page.getViewport({ scale: 1 });
    const scale = Math.min(200 / viewport.width, 250 / viewport.height);
    const scaledViewport = page.getViewport({ scale });
    
    // Create canvas for rendering
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;
    
    // Render page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport,
      canvas: canvas,
    };
    
    await page.render(renderContext).promise;
    
    // Convert canvas to data URL
    const thumbnailUrl = canvas.toDataURL('image/png');
    
    return {
      file,
      thumbnailUrl,
      pageCount: pdf.numPages,
    };
  } catch (error) {
    return {
      file,
      thumbnailUrl: '',
      pageCount: 0,
      error: error instanceof Error ? error.message : 'Failed to generate thumbnail',
    };
  }
}

/**
 * Generate thumbnails for multiple PDF files
 */
export async function generateMultiplePDFThumbnails(
  files: File[],
  onProgress?: (completed: number, total: number) => void
): Promise<PDFThumbnail[]> {
  const thumbnails: PDFThumbnail[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const thumbnail = await generatePDFThumbnail(files[i]);
    thumbnails.push(thumbnail);
    onProgress?.(i + 1, files.length);
  }
  
  return thumbnails;
}

/**
 * Get detailed PDF information including page count
 */
export async function getPDFInfo(file: File): Promise<{ pageCount: number; title?: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const metadata = await pdf.getMetadata();
    
    return {
      pageCount: pdf.numPages,
      title: metadata.info && typeof metadata.info === 'object' && 'Title' in metadata.info ? String(metadata.info.Title) : undefined,
    };
  } catch (error) {
    return {
      pageCount: 0,
    };
  }
}
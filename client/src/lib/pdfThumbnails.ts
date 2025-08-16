import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { ensurePDFWorker } from './pdfWorkerSetup';

// Ensure worker is set up
ensurePDFWorker();

// Enhanced logging
console.log('PDF.js version:', pdfjsLib.version);
console.log('PDF.js worker source:', pdfjsLib.GlobalWorkerOptions.workerSrc);

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
    console.log('🖼️ Generating thumbnail for:', file.name);
    
    // Ensure worker is configured before processing
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      console.log('⚙️ Setting up PDF.js worker...');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    }
    console.log('📋 Worker configured:', pdfjsLib.GlobalWorkerOptions.workerSrc);
    
    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    console.log('📄 File size:', arrayBuffer.byteLength, 'bytes');
    
    // Validate PDF header
    const uint8Array = new Uint8Array(arrayBuffer);
    const header = new TextDecoder().decode(uint8Array.slice(0, 8));
    if (!header.startsWith('%PDF-')) {
      throw new Error(`Invalid PDF header: ${header}`);
    }
    console.log('✅ Valid PDF header:', header);
    
    // Load PDF document with enhanced configuration
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0,
    });
    
    const pdf = await loadingTask.promise;
    console.log('📚 PDF loaded successfully, pages:', pdf.numPages);
    
    // Get the first page
    const page = await pdf.getPage(1);
    console.log('📄 Page 1 loaded');
    
    // Calculate scale for thumbnail (max width: 200px, max height: 250px)
    const viewport = page.getViewport({ scale: 1 });
    const scale = Math.min(200 / viewport.width, 250 / viewport.height);
    const scaledViewport = page.getViewport({ scale });
    
    console.log('📐 Viewport:', viewport.width, 'x', viewport.height, '→', scaledViewport.width, 'x', scaledViewport.height);
    
    // Create canvas for rendering
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;
    
    // Set white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport,
    };
    
    console.log('🎨 Starting render...');
    await page.render(renderContext).promise;
    console.log('✅ Render complete!');
    
    // Convert canvas to data URL
    const thumbnailUrl = canvas.toDataURL('image/png');
    console.log('Thumbnail generated successfully for:', file.name);
    
    return {
      file,
      thumbnailUrl,
      pageCount: pdf.numPages,
    };
  } catch (error) {
    console.error('PDF thumbnail generation failed for:', file.name, error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate thumbnail';
    console.error('Error details:', errorMessage);
    return {
      file,
      thumbnailUrl: '',
      pageCount: 0,
      error: errorMessage,
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
    // Ensure worker is configured before processing
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0,
    });
    const pdf = await loadingTask.promise;
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
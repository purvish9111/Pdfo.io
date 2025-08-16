import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// Set up PDF.js worker - multiple fallbacks
if (typeof window !== 'undefined') {
  // Try different worker sources in order of preference
  const workerSources = [
    // Local build version
    new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString(),
    // CDN fallback
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`,
    // jsDelivr fallback
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
  ];
  
  // Use the local worker file from the Vite public directory
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  
  // Enhanced logging
  console.log('PDF.js version:', pdfjsLib.version);
  console.log('PDF.js worker source:', pdfjsLib.GlobalWorkerOptions.workerSrc);
  
  // Test worker availability
  fetch(pdfjsLib.GlobalWorkerOptions.workerSrc, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        console.log('✅ PDF.js worker is accessible');
      } else {
        console.error('❌ PDF.js worker not accessible:', response.status);
        console.log('🔄 Falling back to simple previews');
      }
    })
    .catch(err => {
      console.error('❌ PDF.js worker test failed:', err.message);
      console.log('🔄 Falling back to simple previews');
    });
}

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
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      disableFontFace: true,
      disableRange: true,
      disableStream: true,
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
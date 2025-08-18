/**
 * Optimized PDF utilities with improved performance and memory management
 */

import { pdfjsLib, PDF_CONFIG } from './pdf-worker-config';

// Cache for rendered pages to avoid re-rendering
const pageCache = new Map<string, string>();
const MAX_CACHE_SIZE = 50; // Limit cache size to prevent memory issues

// Optimized PDF page rendering with caching
export const renderPDFPageOptimized = async (
  file: File,
  pageNumber: number,
  scale: number = 1,
  useCache: boolean = true
): Promise<string> => {
  const cacheKey = `${file.name}-${pageNumber}-${scale}`;
  
  // Check cache first
  if (useCache && pageCache.has(cacheKey)) {
    return pageCache.get(cacheKey)!;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      ...PDF_CONFIG.renderingOptions
    }).promise;
    
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    
    // Create canvas with optimized settings
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', PDF_CONFIG.canvasSettings) as CanvasRenderingContext2D;
    
    if (!context) {
      throw new Error('Could not get canvas context');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render page - FIXED: Add canvas parameter for PDF.js compatibility
    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas
    } as any).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG with 80% quality for smaller size
    
    // Cache the result with size limit
    if (useCache) {
      if (pageCache.size >= MAX_CACHE_SIZE) {
        const firstKey = pageCache.keys().next().value;
        if (firstKey !== undefined) {
          pageCache.delete(firstKey);
        }
      }
      pageCache.set(cacheKey, dataUrl);
    }

    // Clean up
    page.cleanup();
    canvas.remove();
    
    return dataUrl;
  } catch (error) {
    console.error('Error rendering PDF page:', error);
    throw error;
  }
};

// Batch render multiple pages for better performance
export const renderPDFPagesOptimized = async (
  file: File,
  pageNumbers: number[],
  scale: number = 0.5
): Promise<Array<{ pageNumber: number; dataUrl: string }>> => {
  const results: Array<{ pageNumber: number; dataUrl: string }> = [];
  
  // Process pages in batches to avoid overwhelming the browser
  const batchSize = PDF_CONFIG.maxConcurrentRenders;
  
  for (let i = 0; i < pageNumbers.length; i += batchSize) {
    const batch = pageNumbers.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (pageNumber) => {
      try {
        const dataUrl = await renderPDFPageOptimized(file, pageNumber, scale);
        return { pageNumber, dataUrl };
      } catch (error) {
        console.error(`Error rendering page ${pageNumber}:`, error);
        return { pageNumber, dataUrl: '' };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Small delay between batches to prevent blocking UI
    if (i + batchSize < pageNumbers.length) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  
  return results;
};

// Get PDF metadata efficiently
export const getPDFMetadataOptimized = async (file: File) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      ...PDF_CONFIG.renderingOptions
    }).promise;
    
    const metadata = await pdf.getMetadata();
    const pageCount = pdf.numPages;
    
    return {
      pageCount,
      title: (metadata.info as any)?.Title || '',
      author: (metadata.info as any)?.Author || '',
      subject: (metadata.info as any)?.Subject || '',
      keywords: (metadata.info as any)?.Keywords || '',
      creator: (metadata.info as any)?.Creator || '',
      producer: (metadata.info as any)?.Producer || '',
      creationDate: (metadata.info as any)?.CreationDate || null,
      modificationDate: (metadata.info as any)?.ModDate || null,
    };
  } catch (error) {
    console.error('Error getting PDF metadata:', error);
    throw error;
  }
};

// Clear cache to free memory
export const clearPDFCache = () => {
  pageCache.clear();
  // FIXED: Removed cache logging for production performance
};

// Get cache statistics
export const getCacheStats = () => {
  return {
    size: pageCache.size,
    maxSize: MAX_CACHE_SIZE,
    keys: Array.from(pageCache.keys()),
  };
};
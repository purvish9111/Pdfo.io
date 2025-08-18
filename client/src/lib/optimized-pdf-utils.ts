// Optimized PDF utility functions for production performance

import { PDFPerformanceOptimizer } from './performance-optimizations';

// Optimized PDF thumbnail generation with caching
export const generateOptimizedThumbnail = (file: File, scale: number = 0.3): Promise<string> => {
  return PDFPerformanceOptimizer.generateOptimizedThumbnail(file, {
    scale,
    format: 'jpeg',
    quality: 0.8,
    useOffscreenCanvas: true
  });
};

// Optimized PDF processing with memory management
export const processWithOptimization = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  return PDFPerformanceOptimizer.processWithMemoryManagement(async () => {
    const startTime = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      // Only log performance in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`${operationName} completed in ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  });
};

// Batch processing with concurrency control
export const batchProcessFiles = async <T>(
  files: File[],
  processor: (file: File) => Promise<T>,
  concurrency: number = 3
): Promise<T[]> => {
  const results: T[] = [];
  
  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);
    const batchPromises = batch.map(file => 
      processWithOptimization(() => processor(file), `Process ${file.name}`)
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
};

// Memory-optimized PDF page counting
export const getPageCountOptimized = async (file: File): Promise<number> => {
  const cacheKey = `pagecount_${file.name}_${file.size}`;
  
  return PDFPerformanceOptimizer.cacheOperation(cacheKey, async () => {
    const pdfjsLib = await PDFPerformanceOptimizer.initializeOptimizedWorker();
    const arrayBuffer = await file.arrayBuffer();
    
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      disableAutoFetch: true,
      disableStream: true
    }).promise;
    
    return pdf.numPages;
  });
};

// Optimized file validation
export const validatePDFOptimized = async (file: File): Promise<boolean> => {
  try {
    const pageCount = await getPageCountOptimized(file);
    return pageCount > 0;
  } catch (error) {
    return false;
  }
};

// Production-ready error handling for PDF operations
export const handlePDFError = (error: Error, context: string): void => {
  const errorMessage = error.message || 'Unknown error';
  
  // Log essential error info only
  console.error(`PDF Error in ${context}:`, errorMessage);
  
  // In production, would send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { tags: { context } });
  }
};

// Cleanup utilities for memory management
export const cleanupResources = (): void => {
  // Cleanup blob URLs
  const elementsWithBlobUrls = document.querySelectorAll('[src^="blob:"]');
  elementsWithBlobUrls.forEach(element => {
    const src = element.getAttribute('src');
    if (src && src.startsWith('blob:')) {
      URL.revokeObjectURL(src);
    }
  });

  // Cleanup temporary canvases
  const tempCanvases = document.querySelectorAll('canvas[data-temp="true"]');
  tempCanvases.forEach(canvas => canvas.remove());
};

// Performance monitoring utilities
export const measureOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<{ result: T; duration: number; memoryDelta?: number }> => {
  const startTime = performance.now();
  const startMemory = (performance as any).memory?.usedJSHeapSize;
  
  try {
    const result = await operation();
    const endTime = performance.now();
    const endMemory = (performance as any).memory?.usedJSHeapSize;
    
    const duration = endTime - startTime;
    const memoryDelta = startMemory && endMemory ? endMemory - startMemory : undefined;
    
    return { result, duration, memoryDelta };
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`Operation ${operationName} failed after ${duration}ms:`, error);
    throw error;
  }
};
/**
 * Custom hook for performance monitoring and optimization
 */

import { useEffect, useCallback, useRef } from 'react';

// Interface for performance metrics
interface PerformanceMetrics {
  memoryUsage?: {
    usedJSHeapSize: string;
    totalJSHeapSize: string;
    jsHeapSizeLimit: string;
  };
  loadTime: number;
  renderTime: number;
}

// Custom hook for monitoring component performance
export const usePerformance = (componentName: string) => {
  const startTimeRef = useRef<number>(performance.now());
  const renderCountRef = useRef<number>(0);

  useEffect(() => {
    renderCountRef.current += 1;
    const renderTime = performance.now() - startTimeRef.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Component "${componentName}" rendered in ${renderTime.toFixed(2)}ms (render #${renderCountRef.current})`);
    }
  });

  // Memory monitoring
  const getMemoryUsage = useCallback(() => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
        jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
      };
    }
    return null;
  }, []);

  // Performance measurement utilities
  const measureAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ Operation "${operationName}" completed in ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ Operation "${operationName}" failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }, []);

  return {
    getMemoryUsage,
    measureAsyncOperation,
    renderCount: renderCountRef.current,
  };
};

// Hook for optimizing PDF processing performance
export const usePDFPerformance = () => {
  const processingQueueRef = useRef<Array<() => Promise<void>>>([]);
  const isProcessingRef = useRef<boolean>(false);

  const queuePDFOperation = useCallback(async (operation: () => Promise<void>) => {
    processingQueueRef.current.push(operation);
    
    if (!isProcessingRef.current) {
      isProcessingRef.current = true;
      
      while (processingQueueRef.current.length > 0) {
        const nextOperation = processingQueueRef.current.shift();
        if (nextOperation) {
          try {
            await nextOperation();
          } catch (error) {
            console.error('PDF operation failed:', error);
          }
          
          // Small delay between operations to prevent UI blocking
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      
      isProcessingRef.current = false;
    }
  }, []);

  const clearQueue = useCallback(() => {
    processingQueueRef.current = [];
    isProcessingRef.current = false;
  }, []);

  return {
    queuePDFOperation,
    clearQueue,
    queueLength: processingQueueRef.current.length,
    isProcessing: isProcessingRef.current,
  };
};

// Hook for image optimization
export const useImageOptimization = () => {
  const compressImage = useCallback((
    file: File,
    maxWidth: number = 1024,
    quality: number = 0.8
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        }, 'image/jpeg', quality);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  return {
    compressImage,
  };
};
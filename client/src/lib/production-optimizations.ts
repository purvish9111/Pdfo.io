// Production-focused performance optimizations

import { PDFPerformanceOptimizer } from './performance-optimizations';

// Initialize all performance optimizations for production
export const initializeProductionOptimizations = async () => {
  // 1. Bundle optimization
  await PDFPerformanceOptimizer.optimizeBundleLoading();
  
  // 2. Memory management
  setupMemoryMonitoring();
  
  // 3. PDF worker optimization
  await PDFPerformanceOptimizer.initializeOptimizedWorker();
  
  // 4. Service worker for caching
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    registerServiceWorker();
  }
  
  // 5. Critical resource preloading
  preloadCriticalResources();
};

// Memory monitoring for production
const setupMemoryMonitoring = () => {
  if ('memory' in performance) {
    const checkMemory = () => {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      
      // Log memory usage every 5 minutes in production
      if (process.env.NODE_ENV === 'production' && usedMB > 100) {
        console.warn(`High memory usage detected: ${usedMB}MB`);
      }
    };
    
    setInterval(checkMemory, 300000); // 5 minutes
  }
};

// Service worker registration
const registerServiceWorker = async () => {
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('SW registered');
  } catch (error) {
    // Fail silently in production
  }
};

// Preload critical resources
const preloadCriticalResources = () => {
  const criticalResources = [
    '/pdf.worker.min.js',
    // Add other critical resources based on usage analytics
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource;
    document.head.appendChild(link);
  });
};

// Remove all debug console logs for production
export const removeDebugLogs = () => {
  if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    // Keep console.warn and console.error for production monitoring
  }
};

// Optimize PDF processing for production
export const optimizePDFProcessing = () => {
  // Use WebAssembly for PDF processing if available
  if ('WebAssembly' in window) {
    // PDF.js already uses WASM when available
  }
  
  // Optimize canvas rendering
  const optimizeCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Disable image smoothing for performance on low-end devices
      const connection = (navigator as any).connection;
      if (connection && connection.effectiveType === '2g') {
        ctx.imageSmoothingEnabled = false;
      }
    }
  };
  
  return { optimizeCanvas };
};

// Production-ready error handling
export class ProductionErrorHandler {
  private static errorCount = 0;
  private static readonly MAX_ERRORS = 10;
  
  static handleError(error: Error, context: string) {
    this.errorCount++;
    
    // Prevent error spam
    if (this.errorCount > this.MAX_ERRORS) {
      return;
    }
    
    // Log essential error info only
    console.error(`Error in ${context}:`, error.message);
    
    // In production, you would send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // trackError(error, context);
    }
  }
  
  static resetErrorCount() {
    this.errorCount = 0;
  }
}

// Clean up remaining console logs throughout the app
export const cleanupProductionLogs = () => {
  // This function will be called to remove any remaining debug logs
  const logStatements = [
    'console.log',
    'console.debug', 
    'console.info'
  ];
  
  // In a real implementation, this would be done at build time
  // For now, we'll override the console methods
  if (process.env.NODE_ENV === 'production') {
    logStatements.forEach(method => {
      (console as any)[method.split('.')[1]] = () => {};
    });
  }
};
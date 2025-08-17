/**
 * Optimized PDF.js worker configuration for better performance
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker for better performance
const WORKER_URL = '/pdf.worker.min.js';

// Set up PDF.js with optimized settings
pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;

// Performance optimization settings
const PDF_CONFIG = {
  // Enable text layer for better accessibility and searchability
  enableTextLayer: true,
  
  // Disable annotations layer for better performance unless needed
  enableAnnotations: false,
  
  // Use smaller canvas size for thumbnails
  thumbnailScale: 0.5,
  
  // Maximum pages to render simultaneously
  maxConcurrentRenders: 3,
  
  // Canvas rendering settings for better performance
  canvasSettings: {
    willReadFrequently: false,
    alpha: false,
  },
  
  // Memory management
  maxImageSize: 16777216, // 16MB max image size
  
  // Rendering options
  renderingOptions: {
    intent: 'display' as const,
    enableWebGL: true,
    renderInteractiveForms: false,
  }
};

export { pdfjsLib, PDF_CONFIG };

// Preload worker for faster first-time loading
export const preloadPDFWorker = () => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = WORKER_URL;
    document.head.appendChild(link);
  }
};

// Initialize PDF.js with optimized settings
export const initializePDFJS = () => {
  // Set global options for better performance
  pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
  
  // Preload the worker
  preloadPDFWorker();
  
  console.log('📋 PDF.js optimized configuration loaded');
};
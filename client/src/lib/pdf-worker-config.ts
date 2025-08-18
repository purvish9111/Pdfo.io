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

// Global flag to prevent multiple worker initializations
let isWorkerInitialized = false;

// FIXED: Centralized worker initialization to prevent conflicts
export const initializePDFJS = () => {
  if (isWorkerInitialized) {
    console.info('📋 PDF.js worker already initialized');
    return;
  }
  
  if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
    // FIXED: Reduce debug logging for production performance
    isWorkerInitialized = true;
    
    // Preload worker for faster first-time loading
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = WORKER_URL;
    document.head.appendChild(link);
  }
};

// FIXED: Removed duplicate function declaration
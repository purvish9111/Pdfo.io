// Dedicated PDF.js worker setup module
import * as pdfjsLib from 'pdfjs-dist';

let workerInitialized = false;

export function ensurePDFWorker(): void {
  if (!workerInitialized) {
    // Set up PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    workerInitialized = true;
    console.log('📋 PDF.js worker initialized:', pdfjsLib.GlobalWorkerOptions.workerSrc);
  }
}

// Initialize immediately
ensurePDFWorker();
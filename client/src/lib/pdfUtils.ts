// Real PDF processing functions that delegate to realPdfUtils.ts
import { 
  mergePDFs as realMergePDFs,
  splitPDF as realSplitPDF,
  reorderPDFPages as realReorderPDFPages,
  rotatePDFPages as realRotatePDFPages,
  compressPDF as realCompressPDF,
  generateRealPDFPages,
  type PDFPage,
  type CompressionLevel
} from './realPdfUtils';

export async function mergePDFs(
  files: File[], 
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  console.log('🔄 mergePDFs delegating to realMergePDFs');
  return realMergePDFs(files, onProgress);
}

export async function splitPDF(file: File, pageRanges: number[][]): Promise<Blob[]> {
  console.log('🔄 splitPDF delegating to realSplitPDF');
  return realSplitPDF(file, pageRanges);
}

export async function reorderPDFPages(file: File, newOrder: number[]): Promise<Blob> {
  console.log('🔄 reorderPDFPages delegating to realReorderPDFPages');
  return realReorderPDFPages(file, newOrder);
}

export async function compressPDF(file: File, compressionLevel: CompressionLevel): Promise<Blob> {
  console.log('🔄 compressPDF delegating to realCompressPDF');
  return realCompressPDF(file, compressionLevel);
}

export async function addPageNumbers(file: File, options: {
  position: 'top' | 'bottom';
  alignment: 'left' | 'center' | 'right';
  startNumber: number;
}): Promise<Blob> {
  // Simulate adding page numbers
  return new Promise((resolve) => {
    setTimeout(() => {
      const numberedBlob = new Blob([file], { type: 'application/pdf' });
      resolve(numberedBlob);
    }, 2000);
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function generatePages(file: File): Promise<PDFPage[]> {
  console.log('🔄 generatePages delegating to generateRealPDFPages');
  return generateRealPDFPages(file);
}

// Export types
export type { PDFPage, CompressionLevel };

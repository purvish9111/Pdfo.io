import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

// Real PDF processing utilities using pdf-lib
export interface PDFPage {
  id: string;
  pageNumber: number;
  rotation?: number;
  deleted?: boolean;
}

export interface PageNumberSettings {
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  format: string;
  fontFamily: string;
  fontSize: number;
  color: string;
}

export interface SplitPoint {
  afterPage: number;
  groupName: string;
}

// Real PDF merging with progress tracking
export async function mergePDFs(
  files: File[], 
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(i, files.length);
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  onProgress?.(files.length, files.length);
  
  const pdfBytes = await mergedPdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// Real PDF splitting - simplified version for page ranges  
export async function splitPDF(file: File, pageRanges: number[][]): Promise<Blob[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  const results: Blob[] = [];
  
  for (const range of pageRanges) {
    const [startPage, endPage] = range;
    const newPdf = await PDFDocument.create();
    
    // PDF pages are 0-indexed, but UI shows 1-indexed
    const pageIndices = Array.from(
      { length: endPage - startPage + 1 }, 
      (_, idx) => startPage - 1 + idx
    );
    
    const copiedPages = await newPdf.copyPages(pdf, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));
    
    const pdfBytes = await newPdf.save();
    results.push(new Blob([pdfBytes], { type: 'application/pdf' }));
  }
  
  return results;
}

// Advanced splitting with named groups
export async function splitPDFWithPoints(file: File, splitPoints: SplitPoint[]): Promise<{ blob: Blob; name: string }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();
  
  const results: { blob: Blob; name: string }[] = [];
  let currentStartPage = 0;
  
  for (let i = 0; i < splitPoints.length; i++) {
    const splitPoint = splitPoints[i];
    const endPage = Math.min(splitPoint.afterPage, totalPages - 1);
    
    if (currentStartPage <= endPage) {
      const newPdf = await PDFDocument.create();
      const pageIndices = Array.from({ length: endPage - currentStartPage + 1 }, (_, idx) => currentStartPage + idx);
      const copiedPages = await newPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      results.push({
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        name: `${splitPoint.groupName}.pdf`
      });
    }
    
    currentStartPage = endPage + 1;
  }
  
  // Add remaining pages if any
  if (currentStartPage < totalPages) {
    const newPdf = await PDFDocument.create();
    const pageIndices = Array.from({ length: totalPages - currentStartPage }, (_, idx) => currentStartPage + idx);
    const copiedPages = await newPdf.copyPages(pdf, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));
    
    const pdfBytes = await newPdf.save();
    results.push({
      blob: new Blob([pdfBytes], { type: 'application/pdf' }),
      name: `remaining-pages.pdf`
    });
  }
  
  return results;
}

// Real PDF page reordering
export async function reorderPDFPages(file: File, newOrder: number[]): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  
  const copiedPages = await newPdf.copyPages(pdf, newOrder);
  copiedPages.forEach((page) => newPdf.addPage(page));
  
  const pdfBytes = await newPdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// Real PDF page deletion
export async function deletePDFPages(file: File, pagesToKeep: number[]): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  
  const copiedPages = await newPdf.copyPages(pdf, pagesToKeep);
  copiedPages.forEach((page) => newPdf.addPage(page));
  
  const pdfBytes = await newPdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// Real PDF page rotation
export async function rotatePDFPages(file: File, rotations: { [pageIndex: number]: number }): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  // Apply rotations
  Object.entries(rotations).forEach(([pageIndex, rotation]) => {
    const page = pdf.getPage(parseInt(pageIndex));
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + rotation));
  });
  
  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// Real PDF page numbering
export async function addPageNumbersToPDF(file: File, settings: PageNumberSettings): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  // Get font
  let font;
  try {
    switch (settings.fontFamily.toLowerCase()) {
      case 'times':
      case 'times new roman':
        font = await pdf.embedFont(StandardFonts.TimesRoman);
        break;
      case 'courier':
      case 'courier new':
        font = await pdf.embedFont(StandardFonts.Courier);
        break;
      case 'helvetica':
        font = await pdf.embedFont(StandardFonts.Helvetica);
        break;
      default:
        font = await pdf.embedFont(StandardFonts.Helvetica);
    }
  } catch (error) {
    font = await pdf.embedFont(StandardFonts.Helvetica);
  }
  
  const pages = pdf.getPages();
  const totalPages = pages.length;
  
  // Parse color
  const colorMatch = settings.color.match(/^#([a-f\d]{6})$/i);
  const color = colorMatch ? 
    rgb(
      parseInt(colorMatch[1].substr(0, 2), 16) / 255,
      parseInt(colorMatch[1].substr(2, 2), 16) / 255,
      parseInt(colorMatch[1].substr(4, 2), 16) / 255
    ) : rgb(0, 0, 0);
  
  pages.forEach((page, index) => {
    const pageNumber = index + 1;
    const text = settings.format
      .replace('{n}', pageNumber.toString())
      .replace('{total}', totalPages.toString())
      .replace('{page}', pageNumber.toString());
    
    const textWidth = font.widthOfTextAtSize(text, settings.fontSize);
    const { width, height } = page.getSize();
    
    let x: number, y: number;
    
    // Calculate position
    switch (settings.position) {
      case 'top-left':
        x = 20;
        y = height - 30;
        break;
      case 'top-center':
        x = (width - textWidth) / 2;
        y = height - 30;
        break;
      case 'top-right':
        x = width - textWidth - 20;
        y = height - 30;
        break;
      case 'bottom-left':
        x = 20;
        y = 20;
        break;
      case 'bottom-center':
        x = (width - textWidth) / 2;
        y = 20;
        break;
      case 'bottom-right':
        x = width - textWidth - 20;
        y = 20;
        break;
      default:
        x = (width - textWidth) / 2;
        y = 20;
    }
    
    page.drawText(text, {
      x,
      y,
      size: settings.fontSize,
      font,
      color,
    });
  });
  
  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// Get PDF page count
export async function getPDFPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    return pdf.getPageCount();
  } catch (error) {
    console.error('Error getting PDF page count:', error);
    return 0;
  }
}

// Generate actual PDF pages array from file
export async function generateRealPDFPages(file: File): Promise<PDFPage[]> {
  const pageCount = await getPDFPageCount(file);
  return Array.from({ length: pageCount }, (_, index) => ({
    id: `page-${index + 1}-${Date.now()}`,
    pageNumber: index + 1,
    rotation: 0,
    deleted: false,
  }));
}

// Utility function to download blob
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
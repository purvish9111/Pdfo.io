// Consolidated PDF.js utilities - combining worker setup, debugging, and testing
import * as pdfjsLib from 'pdfjs-dist';

// Worker initialization state
let workerInitialized = false;

export function ensurePDFWorker(): void {
  if (!workerInitialized) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    workerInitialized = true;
    console.log('📋 PDF.js worker initialized:', pdfjsLib.GlobalWorkerOptions.workerSrc);
  }
}

// Test PDF worker functionality
export async function testPDFWorker(): Promise<{
  workerLoaded: boolean;
  version: string;
  error?: string;
}> {
  try {
    console.log('PDF.js version:', pdfjsLib.version);
    console.log('Worker src:', pdfjsLib.GlobalWorkerOptions.workerSrc);

    // Try to create a simple PDF document to test worker
    const testPDFData = new Uint8Array([
      0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34, 0x0A, // %PDF-1.4
      0x25, 0xC7, 0xEC, 0x8F, 0xA2, 0x0A, // Binary marker
    ]);

    const loadingTask = pdfjsLib.getDocument({
      data: testPDFData,
      verbosity: 0,
    });

    try {
      await loadingTask.promise;
      return { workerLoaded: true, version: pdfjsLib.version };
    } catch (pdfError) {
      // Expected to fail with minimal data, but worker should load
      if (pdfError instanceof Error && pdfError.message.includes('Invalid PDF')) {
        return { workerLoaded: true, version: pdfjsLib.version };
      }
      throw pdfError;
    }
  } catch (error) {
    return {
      workerLoaded: false,
      version: pdfjsLib.version,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Debug PDF files
export async function debugPDFFile(file: File): Promise<{
  isValidPDF: boolean;
  fileInfo: { name: string; size: number; type: string };
  pdfInfo?: { numPages: number; version: string; producer?: string; creator?: string };
  workerStatus: { workerSrc: string; version: string };
  error?: string;
}> {
  console.group(`🔍 Debugging PDF: ${file.name}`);
  
  const result = {
    isValidPDF: false,
    fileInfo: { name: file.name, size: file.size, type: file.type },
    workerStatus: {
      workerSrc: pdfjsLib.GlobalWorkerOptions.workerSrc || 'Not set',
      version: pdfjsLib.version,
    },
  } as any;

  try {
    console.log('File info:', result.fileInfo);
    console.log('Worker status:', result.workerStatus);

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const header = new TextDecoder().decode(uint8Array.slice(0, 8));
    
    console.log('File header:', header);
    
    if (!header.startsWith('%PDF-')) {
      throw new Error(`Invalid PDF header: ${header}`);
    }

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 1,
    });

    const pdf = await loadingTask.promise;
    const metadata = await pdf.getMetadata();

    result.isValidPDF = true;
    result.pdfInfo = {
      numPages: pdf.numPages,
      version: 'Unknown',
      producer: metadata.info && typeof metadata.info === 'object' && 'Producer' in metadata.info ? String(metadata.info.Producer) : undefined,
      creator: metadata.info && typeof metadata.info === 'object' && 'Creator' in metadata.info ? String(metadata.info.Creator) : undefined,
    };

    console.log('PDF info:', result.pdfInfo);
    console.log('✅ PDF is valid and loadable');
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    console.error('❌ PDF loading failed:', result.error);
  }

  console.groupEnd();
  return result;
}

// Log PDF rendering details
export function logPDFRenderingDetails(canvas: HTMLCanvasElement, viewport: any) {
  console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
  console.log('Viewport:', viewport.width, 'x', viewport.height, 'scale:', viewport.scale);
  console.log('Canvas data URL length:', canvas.toDataURL('image/png').length);
}

// Initialize worker immediately when module loads
ensurePDFWorker();
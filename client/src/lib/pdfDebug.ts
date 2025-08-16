// Enhanced PDF debugging utilities
import * as pdfjsLib from 'pdfjs-dist';

export async function debugPDFFile(file: File): Promise<{
  isValidPDF: boolean;
  fileInfo: {
    name: string;
    size: number;
    type: string;
  };
  pdfInfo?: {
    numPages: number;
    version: string;
    producer?: string;
    creator?: string;
  };
  workerStatus: {
    workerSrc: string;
    version: string;
  };
  error?: string;
}> {
  console.group(`🔍 Debugging PDF: ${file.name}`);
  
  const result = {
    isValidPDF: false,
    fileInfo: {
      name: file.name,
      size: file.size,
      type: file.type,
    },
    workerStatus: {
      workerSrc: pdfjsLib.GlobalWorkerOptions.workerSrc || 'Not set',
      version: pdfjsLib.version,
    },
  } as any;

  try {
    // Check file basics
    console.log('File info:', result.fileInfo);
    console.log('Worker status:', result.workerStatus);

    // Read file header to check if it's a valid PDF
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const header = new TextDecoder().decode(uint8Array.slice(0, 8));
    
    console.log('File header:', header);
    
    if (!header.startsWith('%PDF-')) {
      throw new Error(`Invalid PDF header: ${header}`);
    }

    // Try to load the PDF
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 1, // Enable detailed logging
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

export function logPDFRenderingDetails(canvas: HTMLCanvasElement, viewport: any) {
  console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
  console.log('Viewport:', viewport.width, 'x', viewport.height, 'scale:', viewport.scale);
  console.log('Canvas data URL length:', canvas.toDataURL('image/png').length);
}
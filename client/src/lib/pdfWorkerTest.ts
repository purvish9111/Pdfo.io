// Test PDF.js worker setup and diagnose issues
import * as pdfjsLib from 'pdfjs-dist';

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
      // Minimal PDF structure would go here, but this is just for testing
    ]);

    // This will fail gracefully if worker isn't loaded
    const loadingTask = pdfjsLib.getDocument({
      data: testPDFData,
      verbosity: 0, // Reduce console noise
    });

    try {
      await loadingTask.promise;
      return {
        workerLoaded: true,
        version: pdfjsLib.version,
      };
    } catch (pdfError) {
      // Expected to fail with minimal data, but worker should load
      if (pdfError instanceof Error && pdfError.message.includes('Invalid PDF')) {
        return {
          workerLoaded: true,
          version: pdfjsLib.version,
        };
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
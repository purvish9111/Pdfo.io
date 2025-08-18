// Simple PDF preview fallback without PDF.js dependency
// This provides basic file info and placeholder thumbnails

export interface SimplePDFThumbnail {
  file: File;
  thumbnailUrl: string;
  pageCount: number;
  error?: string;
  isPlaceholder: boolean;
}

/**
 * Generate a simple placeholder thumbnail for PDF files
 * Used as fallback when PDF.js fails to load
 */
export async function generateSimplePDFThumbnail(file: File): Promise<SimplePDFThumbnail> {
  try {
    // Create a simple placeholder thumbnail
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 200;
    canvas.height = 250;
    
    // Draw a simple PDF icon placeholder
    context.fillStyle = '#f8f9fa';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    context.strokeStyle = '#dee2e6';
    context.lineWidth = 2;
    context.strokeRect(0, 0, canvas.width, canvas.height);
    
    // PDF icon
    context.fillStyle = '#6c757d';
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.fillText('PDF', canvas.width / 2, canvas.height / 2 - 10);
    
    // File name
    context.font = '12px Arial';
    context.fillStyle = '#495057';
    const fileName = file.name.length > 25 ? file.name.substring(0, 25) + '...' : file.name;
    context.fillText(fileName, canvas.width / 2, canvas.height / 2 + 20);
    
    // File size
    const fileSize = formatFileSize(file.size);
    context.font = '10px Arial';
    context.fillStyle = '#868e96';
    context.fillText(fileSize, canvas.width / 2, canvas.height / 2 + 40);
    
    const thumbnailUrl = canvas.toDataURL('image/png');
    
    return {
      file,
      thumbnailUrl,
      pageCount: 0, // Unknown page count
      isPlaceholder: true,
    };
  } catch (error) {
    return {
      file,
      thumbnailUrl: '',
      pageCount: 0,
      error: error instanceof Error ? error.message : 'Failed to generate placeholder',
      isPlaceholder: true,
    };
  }
}

/**
 * Generate simple thumbnails for multiple PDF files
 */
export async function generateSimplePDFThumbnails(
  files: File[],
  onProgress?: (completed: number, total: number) => void
): Promise<SimplePDFThumbnail[]> {
  const thumbnails: SimplePDFThumbnail[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const thumbnail = await generateSimplePDFThumbnail(files[i]);
    thumbnails.push(thumbnail);
    onProgress?.(i + 1, files.length);
  }
  
  return thumbnails;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
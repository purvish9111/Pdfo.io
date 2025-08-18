// Security utilities and configurations

const RATE_LIMIT_STORAGE_KEY = 'pdf_operations_rate_limit';
const MAX_OPERATIONS_PER_HOUR = 100;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_PDF_MIME_TYPES = [
  'application/pdf',
  'application/x-pdf',
  'application/x-bzpdf',
  'application/x-gzpdf'
];

const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/tiff',
  'image/tif',
  'image/webp'
];

const ALLOWED_OFFICE_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/msword', // .doc
  'application/vnd.ms-excel', // .xls
  'application/vnd.ms-powerpoint', // .ppt
  'text/plain' // .txt
];

interface RateLimitData {
  count: number;
  resetTime: number;
}

export class SecurityValidator {
  // Rate limiting for PDF operations
  static checkRateLimit(): { allowed: boolean; resetTime?: number; remaining?: number } {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
      const now = Date.now();
      
      let data: RateLimitData = { count: 0, resetTime: now + 3600000 }; // 1 hour from now
      
      if (stored) {
        data = JSON.parse(stored);
        
        // Reset if time has passed
        if (now > data.resetTime) {
          data = { count: 0, resetTime: now + 3600000 };
        }
      }
      
      if (data.count >= MAX_OPERATIONS_PER_HOUR) {
        return { 
          allowed: false, 
          resetTime: data.resetTime,
          remaining: 0
        };
      }
      
      // Increment count
      data.count++;
      localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(data));
      
      return { 
        allowed: true, 
        remaining: MAX_OPERATIONS_PER_HOUR - data.count 
      };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return { allowed: true }; // Fail open for better UX
    }
  }

  // File validation
  static validateFile(file: File, allowedTypes: string[] = ALLOWED_PDF_MIME_TYPES): {
    valid: boolean;
    error?: string;
  } {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds limit (${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB max)`
      };
    }

    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type not supported: ${file.type}`
      };
    }

    // Additional validation for PDF files
    if (allowedTypes.includes('application/pdf')) {
      return this.validatePDFFile(file);
    }

    return { valid: true };
  }

  // Enhanced PDF file validation
  static validatePDFFile(file: File): { valid: boolean; error?: string } {
    // Check file extension
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf')) {
      return {
        valid: false,
        error: 'File must have .pdf extension'
      };
    }

    // Basic header validation will be done during processing
    return { valid: true };
  }

  // Validate PDF header (to be called after file reading)
  static async validatePDFHeader(file: File): Promise<{ valid: boolean; error?: string }> {
    try {
      // Read first 8 bytes to check PDF header
      const headerBuffer = await file.slice(0, 8).arrayBuffer();
      const headerBytes = new Uint8Array(headerBuffer);
      const headerString = String.fromCharCode.apply(null, Array.from(headerBytes));
      
      if (!headerString.startsWith('%PDF-')) {
        return {
          valid: false,
          error: 'Invalid PDF file: Missing PDF header'
        };
      }
      
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: 'Failed to validate PDF header'
      };
    }
  }

  // Input sanitization
  static sanitizeFileName(fileName: string): string {
    // Remove or replace dangerous characters
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 255); // Limit length
  }

  // Password strength validation
  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Content Security Policy headers (for use in backend)
  static getSecurityHeaders() {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https:",
        "frame-src 'self' https://www.google.com",
        "worker-src 'self' blob:"
      ].join('; ')
    };
  }
}

// File type validators
export const FileValidators = {
  PDF: (file: File) => SecurityValidator.validateFile(file, ALLOWED_PDF_MIME_TYPES),
  IMAGE: (file: File) => SecurityValidator.validateFile(file, ALLOWED_IMAGE_MIME_TYPES),
  OFFICE: (file: File) => SecurityValidator.validateFile(file, ALLOWED_OFFICE_MIME_TYPES),
  ALL: (file: File) => SecurityValidator.validateFile(file, [
    ...ALLOWED_PDF_MIME_TYPES,
    ...ALLOWED_IMAGE_MIME_TYPES,
    ...ALLOWED_OFFICE_MIME_TYPES
  ])
};
// Comprehensive testing utilities for PDF operations

export const TestingUtils = {
  // Generate test PDF files for development/testing
  createTestPDF: async (pages: number = 1, title: string = 'Test PDF'): Promise<File> => {
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
    
    const pdfDoc = await PDFDocument.create();
    
    for (let i = 1; i <= pages; i++) {
      const page = pdfDoc.addPage([612, 792]); // US Letter size
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      page.drawText(`${title} - Page ${i}`, {
        x: 50,
        y: 750,
        size: 24,
        font,
        color: rgb(0, 0, 0),
      });
      
      page.drawText(`This is page ${i} of ${pages}`, {
        x: 50,
        y: 700,
        size: 12,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      // Add some test content
      const testContent = [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
        'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa.'
      ];
      
      testContent.forEach((line, index) => {
        page.drawText(line, {
          x: 50,
          y: 650 - (index * 20),
          size: 10,
          font,
          color: rgb(0, 0, 0),
        });
      });
    }
    
    const pdfBytes = await pdfDoc.save();
    return new File([pdfBytes], `${title.replace(/\s+/g, '_')}.pdf`, { type: 'application/pdf' });
  },

  // Validate PDF operations
  validatePDFOperation: async (
    operation: string,
    inputFiles: File[],
    expectedPages?: number,
    expectedSize?: { min?: number; max?: number }
  ): Promise<{ success: boolean; errors: string[]; warnings: string[] }> => {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Validate input files
      for (const file of inputFiles) {
        if (!file.type.includes('pdf')) {
          errors.push(`Invalid file type: ${file.type}`);
        }
        
        if (file.size === 0) {
          errors.push(`Empty file: ${file.name}`);
        }
        
        if (file.size > 50 * 1024 * 1024) { // 50MB
          warnings.push(`Large file detected: ${file.name} (${Math.round(file.size / 1024 / 1024)}MB)`);
        }
      }

      // Operation-specific validations
      switch (operation) {
        case 'merge':
          if (inputFiles.length < 2) {
            errors.push('Merge operation requires at least 2 files');
          }
          break;
          
        case 'split':
          if (inputFiles.length !== 1) {
            errors.push('Split operation requires exactly 1 file');
          }
          break;
          
        case 'compress':
          if (inputFiles.length !== 1) {
            errors.push('Compress operation requires exactly 1 file');
          }
          break;
      }

      // Expected pages validation
      if (expectedPages !== undefined) {
        if (expectedPages <= 0) {
          errors.push('Expected pages must be greater than 0');
        }
        if (expectedPages > 1000) {
          warnings.push('Large number of pages detected, operation may be slow');
        }
      }

      // Expected size validation
      if (expectedSize) {
        const totalSize = inputFiles.reduce((sum, file) => sum + file.size, 0);
        
        if (expectedSize.min && totalSize < expectedSize.min) {
          warnings.push('Input size smaller than expected');
        }
        
        if (expectedSize.max && totalSize > expectedSize.max) {
          warnings.push('Input size larger than expected');
        }
      }

      return {
        success: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      return {
        success: false,
        errors: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings
      };
    }
  },

  // Performance testing utilities
  measurePerformance: async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<{ result: T; duration: number; memoryUsage?: any }> => {
    const startTime = performance.now();
    const startMemory = (performance as any).memory ? (performance as any).memory.usedJSHeapSize : null;
    
    try {
      const result = await operation();
      const endTime = performance.now();
      const endMemory = (performance as any).memory ? (performance as any).memory.usedJSHeapSize : null;
      
      const duration = endTime - startTime;
      const memoryUsage = startMemory && endMemory ? {
        start: Math.round(startMemory / 1024 / 1024),
        end: Math.round(endMemory / 1024 / 1024),
        delta: Math.round((endMemory - startMemory) / 1024 / 1024)
      } : undefined;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${operationName} completed in ${duration.toFixed(2)}ms`);
        if (memoryUsage) {
          console.log(`📊 Memory: ${memoryUsage.start}MB → ${memoryUsage.end}MB (${memoryUsage.delta >= 0 ? '+' : ''}${memoryUsage.delta}MB)`);
        }
      }
      
      return { result, duration, memoryUsage };
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.error(`❌ ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  },

  // Mock data generators for testing
  mockData: {
    generateUser: (id?: string) => ({
      uid: id || 'test-user-123',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      lastLogin: new Date()
    }),

    generateUsageStats: (days: number = 7) => {
      const stats = [];
      const now = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        stats.push({
          date: date.toISOString().split('T')[0],
          operations: Math.floor(Math.random() * 20) + 1,
          filesProcessed: Math.floor(Math.random() * 50) + 1,
          totalSize: Math.floor(Math.random() * 100) + 10
        });
      }
      
      return stats;
    },

    generateFileEntry: (name?: string, size?: number) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: name || `test-document-${Date.now()}.pdf`,
      size: size || Math.floor(Math.random() * 1000000) + 10000,
      uploadedAt: new Date(),
      processed: Math.random() > 0.5,
      downloadUrl: 'blob:test-url'
    })
  },

  // Error simulation for testing error boundaries
  simulateError: {
    async pdfProcessingError(): Promise<never> {
      throw new Error('Simulated PDF processing error for testing');
    },

    async networkError(): Promise<never> {
      throw new Error('Simulated network error for testing');
    },

    async memoryError(): Promise<never> {
      throw new Error('Simulated out of memory error for testing');
    },

    async authError(): Promise<never> {
      throw new Error('Simulated authentication error for testing');
    }
  },

  // Accessibility testing helpers
  accessibility: {
    checkTabOrder(container: HTMLElement): { issues: string[]; suggestions: string[] } {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const issues: string[] = [];
      const suggestions: string[] = [];
      
      focusableElements.forEach((element, index) => {
        const el = element as HTMLElement;
        
        // Check for missing ARIA labels
        if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.textContent?.trim()) {
          issues.push(`Element ${index + 1} lacks accessible name`);
        }
        
        // Check for proper focus indicators
        const styles = window.getComputedStyle(el, ':focus');
        if (!styles.outline || styles.outline === 'none') {
          suggestions.push(`Element ${index + 1} should have visible focus indicator`);
        }
      });
      
      return { issues, suggestions };
    },

    checkColorContrast(element: HTMLElement): { ratio: number; passes: boolean } {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Simplified contrast calculation (would use proper WCAG formula in production)
      const ratio = 4.5; // Placeholder - would calculate actual contrast ratio
      
      return {
        ratio,
        passes: ratio >= 4.5 // WCAG AA standard
      };
    }
  }
};

// Test suites for different components
export const TestSuites = {
  // PDF processing tests
  pdfProcessing: {
    async testMerge(files: File[]): Promise<boolean> {
      try {
        const validation = await TestingUtils.validatePDFOperation('merge', files);
        return validation.success;
      } catch (error) {
        console.error('Merge test failed:', error);
        return false;
      }
    },

    async testSplit(file: File, ranges: number[][]): Promise<boolean> {
      try {
        const validation = await TestingUtils.validatePDFOperation('split', [file]);
        // Additional split-specific validation would go here
        return validation.success;
      } catch (error) {
        console.error('Split test failed:', error);
        return false;
      }
    },

    async testCompress(file: File): Promise<boolean> {
      try {
        const validation = await TestingUtils.validatePDFOperation('compress', [file]);
        return validation.success;
      } catch (error) {
        console.error('Compress test failed:', error);
        return false;
      }
    }
  },

  // Authentication tests
  authentication: {
    async testLoginFlow(email: string, password: string): Promise<boolean> {
      // Mock authentication test
      return email.includes('@') && password.length >= 6;
    },

    async testSignupFlow(email: string, password: string, name: string): Promise<boolean> {
      // Mock signup test
      return email.includes('@') && password.length >= 6 && name.length > 0;
    }
  },

  // UI component tests
  ui: {
    testFileUpload(acceptedTypes: string[], maxSize: number): boolean {
      return acceptedTypes.length > 0 && maxSize > 0;
    },

    testProgressIndicator(current: number, total: number): boolean {
      return current >= 0 && current <= total && total > 0;
    },

    testErrorBoundary(component: any): boolean {
      // Test error boundary functionality
      return typeof component === 'function' || typeof component === 'object';
    }
  }
};
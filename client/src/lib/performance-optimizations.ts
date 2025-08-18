// Performance optimization utilities and monitoring

interface PerformanceMetrics {
  memoryUsage: {
    used: number;
    total: number;
    limit: number;
  };
  renderTimes: number[];
  bundleSize: number;
  cacheHitRate: number;
}

// PDF processing performance optimizations
export class PDFPerformanceOptimizer {
  private static memoryCache = new Map<string, any>();
  private static readonly MAX_CACHE_SIZE = 50;
  private static readonly MEMORY_THRESHOLD = 100 * 1024 * 1024; // 100MB

  // Optimized PDF worker management
  static async initializeOptimizedWorker(): Promise<any> {
    // Use a single global worker instance
    if ((window as any).__pdfWorker) {
      return (window as any).__pdfWorker;
    }

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      (window as any).__pdfWorker = pdfjsLib;
      return pdfjsLib;
    } catch (error) {
      throw new Error('Failed to initialize PDF worker');
    }
  }

  // Memory-efficient PDF processing
  static async processWithMemoryManagement<T>(
    operation: () => Promise<T>,
    memoryCheck: boolean = true
  ): Promise<T> {
    if (memoryCheck) {
      await this.checkMemoryUsage();
    }

    try {
      const result = await operation();
      
      // Clean up after large operations
      if (this.isMemoryHigh()) {
        this.clearNonEssentialCaches();
        this.triggerGarbageCollection();
      }
      
      return result;
    } catch (error) {
      // Clean up on error
      this.clearNonEssentialCaches();
      throw error;
    }
  }

  // Efficient caching with memory limits
  static cacheOperation<T>(
    key: string,
    operation: () => Promise<T>,
    ttl: number = 300000 // 5 minutes
  ): Promise<T> {
    const cached = this.memoryCache.get(key);
    
    if (cached && cached.expiry > Date.now()) {
      return Promise.resolve(cached.data);
    }

    return operation().then(result => {
      // Implement LRU cache with memory limits
      if (this.memoryCache.size >= this.MAX_CACHE_SIZE) {
        const firstKey = this.memoryCache.keys().next().value;
        this.memoryCache.delete(firstKey);
      }

      this.memoryCache.set(key, {
        data: result,
        expiry: Date.now() + ttl
      });

      return result;
    });
  }

  // Optimized PDF thumbnail generation
  static async generateOptimizedThumbnail(
    file: File,
    options: {
      scale?: number;
      format?: 'jpeg' | 'webp';
      quality?: number;
      useOffscreenCanvas?: boolean;
    } = {}
  ): Promise<string> {
    const {
      scale = 0.3,
      format = 'jpeg',
      quality = 0.7,
      useOffscreenCanvas = true
    } = options;

    const cacheKey = `thumb_${file.name}_${file.size}_${scale}_${format}`;
    
    return this.cacheOperation(cacheKey, async () => {
      const pdfjsLib = await this.initializeOptimizedWorker();
      const arrayBuffer = await file.arrayBuffer();
      
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        disableAutoFetch: true,
        disableStream: true
      }).promise;

      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale });

      // Use OffscreenCanvas for better performance if available
      const canvas = useOffscreenCanvas && 'OffscreenCanvas' in window
        ? new OffscreenCanvas(viewport.width, viewport.height)
        : document.createElement('canvas');

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const context = canvas.getContext('2d', {
        alpha: false,
        desynchronized: true
      });

      if (!context) throw new Error('Could not get canvas context');

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      // Convert to optimized format
      if (useOffscreenCanvas && canvas instanceof OffscreenCanvas) {
        const blob = await canvas.convertToBlob({
          type: `image/${format}`,
          quality
        });
        return URL.createObjectURL(blob);
      } else {
        return (canvas as HTMLCanvasElement).toDataURL(`image/${format}`, quality);
      }
    });
  }

  // Bundle size optimization
  static async optimizeBundleLoading(): Promise<void> {
    // Preload critical resources
    const criticalResources = [
      '/pdf.worker.min.js',
      // Add other critical resources
    ];

    const promises = criticalResources.map(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'script';
      document.head.appendChild(link);
      
      return new Promise((resolve) => {
        link.onload = resolve;
        link.onerror = resolve; // Don't fail on individual resource errors
      });
    });

    await Promise.all(promises);
  }

  // Memory monitoring and cleanup
  private static async checkMemoryUsage(): Promise<void> {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      
      if (memory.usedJSHeapSize > this.MEMORY_THRESHOLD) {
        await this.performMemoryCleanup();
      }
    }
  }

  private static isMemoryHigh(): boolean {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize > this.MEMORY_THRESHOLD;
    }
    return false;
  }

  private static clearNonEssentialCaches(): void {
    // Clear file caches but keep essential data
    const essentialKeys = Array.from(this.memoryCache.keys())
      .filter(key => key.includes('auth_') || key.includes('user_'));
    
    this.memoryCache.clear();
    
    // Restore essential data
    essentialKeys.forEach(key => {
      // Would restore from persistent storage if needed
    });
  }

  private static triggerGarbageCollection(): void {
    // Request garbage collection if available (development only)
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc?.();
    }
  }

  private static async performMemoryCleanup(): Promise<void> {
    // Clear temporary canvases
    document.querySelectorAll('canvas').forEach(canvas => {
      if (canvas.getAttribute('data-temporary') === 'true') {
        canvas.remove();
      }
    });

    // Clear blob URLs
    const blobUrls = Array.from(this.memoryCache.values())
      .filter(item => typeof item.data === 'string' && item.data.startsWith('blob:'));
    
    blobUrls.forEach(item => {
      URL.revokeObjectURL(item.data);
    });

    this.clearNonEssentialCaches();
  }
}

// Component-level performance optimizations
export class ComponentPerformanceOptimizer {
  // Optimize React components
  static memoizeComponent<T extends React.ComponentType<any>>(
    Component: T,
    areEqual?: (prevProps: any, nextProps: any) => boolean
  ): React.MemoExoticComponent<T> {
    return React.memo(Component, areEqual);
  }

  // Debounced file processing
  static debounceFileProcessing<T extends (...args: any[]) => any>(
    func: T,
    delay: number = 300
  ): T {
    let timeoutId: NodeJS.Timeout;
    
    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      
      return new Promise((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            const result = await func(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    }) as T;
  }

  // Virtual scrolling for large lists
  static calculateVisibleItems(
    totalItems: number,
    containerHeight: number,
    itemHeight: number,
    scrollTop: number
  ): { start: number; end: number; total: number } {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + visibleCount + 2, totalItems); // +2 for buffer
    
    return { start: Math.max(0, start - 1), end, total: totalItems };
  }

  // Image lazy loading optimization
  static setupImageLazyLoading(container: HTMLElement): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px'
      });

      container.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
}

// Network performance optimizations
export class NetworkPerformanceOptimizer {
  private static requestCache = new Map<string, Promise<any>>();

  // Request deduplication
  static async deduplicateRequest<T>(
    key: string,
    request: () => Promise<T>
  ): Promise<T> {
    if (this.requestCache.has(key)) {
      return this.requestCache.get(key)!;
    }

    const promise = request().finally(() => {
      this.requestCache.delete(key);
    });

    this.requestCache.set(key, promise);
    return promise;
  }

  // Optimized file chunking for uploads
  static async uploadFileInChunks(
    file: File,
    chunkSize: number = 1024 * 1024, // 1MB chunks
    onProgress?: (progress: number) => void
  ): Promise<void> {
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      // Upload chunk (implementation would depend on backend)
      await this.uploadChunk(chunk, i, totalChunks);
      
      if (onProgress) {
        onProgress((i + 1) / totalChunks);
      }
    }
  }

  private static async uploadChunk(
    chunk: Blob,
    index: number,
    total: number
  ): Promise<void> {
    // Placeholder for chunk upload implementation
    return new Promise(resolve => setTimeout(resolve, 10));
  }
}

// Add React import
import React from 'react';
/**
 * Performance monitoring and optimization utilities
 */

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Track Cumulative Layout Shift (CLS)
  const trackCLS = () => {
    let clsValue = 0;
    let clsEntries: any[] = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // FIXED: Type cast to access hadRecentInput property
        if (!(entry as any).hadRecentInput) {
          const firstSessionEntry = clsEntries[0];
          const lastSessionEntry = clsEntries[clsEntries.length - 1];

          if (!firstSessionEntry || 
              entry.startTime - lastSessionEntry.startTime > 1000 ||
              entry.startTime - firstSessionEntry.startTime > 5000) {
            firstSessionEntry && reportCLS();
            clsEntries = [entry];
          } else {
            clsEntries.push(entry);
          }
        }
      }
    });

    const reportCLS = () => {
      clsValue = clsEntries.reduce((sum, entry) => sum + entry.value, 0);
      console.log('CLS:', clsValue);
    };

    observer.observe({ type: 'layout-shift', buffered: true });
  };

  // Track Largest Contentful Paint (LCP)
  const trackLCP = () => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  };

  // Track First Input Delay (FID)  
  const trackFID = () => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // FIXED: Type cast to access processingStart property
        console.log('FID:', (entry as any).processingStart - entry.startTime);
      }
    });

    observer.observe({ type: 'first-input', buffered: true });
  };

  // Initialize tracking
  trackCLS();
  trackLCP();
  trackFID();
};

// Resource loading optimization
export const optimizeResourceLoading = () => {
  if (typeof window === 'undefined') return;

  // Preload critical resources
  const preloadCriticalResources = () => {
    const criticalResources = [
      { href: '/pdf.worker.min.js', as: 'script' },
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' },
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      document.head.appendChild(link);
    });
  };

  preloadCriticalResources();
};

// Bundle size analysis
export const analyzeBundleSize = () => {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('.js') || entry.name.includes('.css')) {
        // FIXED: Removed bundle logging for production performance
      }
    }
  });

  observer.observe({ type: 'navigation', buffered: true });
  observer.observe({ type: 'resource', buffered: true });
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (typeof window === 'undefined' || !('memory' in performance)) return;

  const memory = (performance as any).memory;
  const memoryInfo = {
    usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
    totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
    jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
  };

  // FIXED: Removed memory logging for production performance
  return memoryInfo;
};

// Initialize performance monitoring
export const initializePerformanceMonitoring = () => {
  trackWebVitals();
  optimizeResourceLoading();
  analyzeBundleSize();
  
  // Monitor memory usage every 30 seconds
  setInterval(monitorMemoryUsage, 30000);
};
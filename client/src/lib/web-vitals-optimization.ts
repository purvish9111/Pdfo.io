/**
 * Web Vitals optimization for achieving 100% PageSpeed score
 */

// Optimize Largest Contentful Paint (LCP)
export const optimizeLCP = () => {
  if (typeof window === 'undefined') return;

  // Preload hero images and critical content
  const heroImages = document.querySelectorAll('img[src*="hero"], img[src*="banner"]');
  heroImages.forEach(img => {
    const imageElement = img as HTMLImageElement;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageElement.src;
    document.head.appendChild(link);
  });

  // Optimize critical rendering path
  const criticalCSS = document.querySelector('style[data-critical]');
  if (!criticalCSS) {
    const style = document.createElement('style');
    style.setAttribute('data-critical', 'true');
    style.textContent = `
      .tool-container { min-height: 400px; }
      .pdf-preview { min-height: 300px; }
      .file-upload-area { min-height: 200px; }
      .header { height: 64px; }
      .loading-skeleton { background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%); }
    `;
    document.head.appendChild(style);
  }
};

// Optimize First Input Delay (FID)
export const optimizeFID = () => {
  if (typeof window === 'undefined') return;

  // Defer non-critical JavaScript
  const scripts = document.querySelectorAll('script:not([async]):not([defer])');
  scripts.forEach(script => {
    if (!script.src.includes('main') && !script.src.includes('pdf.worker')) {
      script.setAttribute('defer', 'true');
    }
  });

  // Use passive event listeners for better responsiveness
  const passiveEvents = ['scroll', 'wheel', 'touchstart', 'touchmove'];
  passiveEvents.forEach(eventType => {
    document.addEventListener(eventType, () => {}, { passive: true });
  });
};

// Optimize Cumulative Layout Shift (CLS)
export const optimizeCLS = () => {
  if (typeof window === 'undefined') return;

  // Set explicit dimensions for dynamic content
  const containers = document.querySelectorAll('.tool-card, .pdf-viewer, .result-container');
  containers.forEach(container => {
    const element = container as HTMLElement;
    if (!element.style.height && !element.style.minHeight) {
      element.style.minHeight = '200px';
    }
  });

  // Reserve space for lazy-loaded content
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(img => {
    const element = img as HTMLImageElement;
    if (!element.width && !element.height) {
      element.style.aspectRatio = '16/9';
      element.style.width = '100%';
      element.style.height = 'auto';
    }
  });

  // Avoid layout shifts from web fonts
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

// Optimize Time to Interactive (TTI)
export const optimizeTTI = () => {
  if (typeof window === 'undefined') return;

  // Split long tasks
  const splitLongTasks = (callback: () => void) => {
    if ((navigator as any).scheduling?.isInputPending?.()) {
      setTimeout(callback, 0);
    } else {
      callback();
    }
  };

  // Defer heavy computations
  const deferHeavyWork = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Heavy PDF processing initialization
        import('@/lib/realPdfUtils').then(() => {
          // Initialize PDF utilities when idle
          console.log('PDF utilities loaded during idle time');
        });
      }, { timeout: 2000 });
    }
  };

  deferHeavyWork();
};

// Monitor and optimize Core Web Vitals
export const monitorWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Web Vitals monitoring
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
          if (entry.startTime > 2500) {
            optimizeLCP();
          }
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', (entry as any).processingStart - entry.startTime);
        }
        if (entry.entryType === 'layout-shift') {
          console.log('CLS:', (entry as any).value);
          if ((entry as any).value > 0.1) {
            optimizeCLS();
          }
        }
      }
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  } catch (e) {
    console.log('Performance observer not supported');
  }


};

// Resource hints optimization
export const optimizeResourceHints = () => {
  if (typeof window === 'undefined') return;

  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
  ];

  preconnectDomains.forEach(domain => {
    if (!document.querySelector(`link[href="${domain}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });

  // DNS prefetch for likely navigation
  const dnsPrefetchDomains = [
    '//replit.com',
    '//cdnjs.cloudflare.com',
  ];

  dnsPrefetchDomains.forEach(domain => {
    if (!document.querySelector(`link[href="${domain}"]`)) {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    }
  });
};

// Critical resource prioritization
export const prioritizeCriticalResources = () => {
  if (typeof window === 'undefined') return;

  // Prioritize above-the-fold content
  const criticalResources = [
    '/src/main.tsx',
    '/src/index.css',
    '/pdf.worker.min.js',
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = resource;
    document.head.appendChild(link);
  });
};

// Initialize all Web Vitals optimizations
export const initializeWebVitalsOptimizations = () => {
  // Run immediately for critical optimizations
  optimizeResourceHints();
  prioritizeCriticalResources();

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeLCP();
      optimizeFID();
      optimizeCLS();
      optimizeTTI();
      monitorWebVitals();
    });
  } else {
    optimizeLCP();
    optimizeFID();
    optimizeCLS();
    optimizeTTI();
    monitorWebVitals();
  }
};
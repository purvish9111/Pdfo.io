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
    const scriptElement = script as HTMLScriptElement;
    if (!scriptElement.src.includes('main') && !scriptElement.src.includes('pdf.worker')) {
      scriptElement.setAttribute('defer', 'true');
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
    // Track LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      if (lastEntry.renderTime || lastEntry.loadTime) {
        const lcp = lastEntry.renderTime || lastEntry.loadTime;
        console.log('LCP:', lcp);
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Track FID
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // Track CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log('CLS:', clsValue);
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

  } catch (error) {
    console.warn('Web Vitals monitoring not supported:', error);
  }
};

// Initialize all Web Vitals optimizations
export const initializeWebVitalsOptimizations = () => {
  if (typeof window === 'undefined') return;
  
  // Run optimizations when DOM is ready
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
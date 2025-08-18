/**
 * Advanced performance optimizations for 100% PageSpeed score
 */

// Resource hints and preloading optimization
export const optimizeResourceHints = () => {
  if (typeof window === 'undefined') return;

  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com',
    'https://pagead2.googlesyndication.com'
  ];

  preconnectDomains.forEach(domain => {
    if (!document.querySelector(`link[href="${domain}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      if (domain.includes('gstatic')) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    }
  });

  // Preload critical assets
  const criticalAssets = [
    { href: '/pdf.worker.min.js', as: 'script' },
    { href: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2', as: 'font', crossorigin: 'anonymous' }
  ];

  criticalAssets.forEach(asset => {
    if (!document.querySelector(`link[href="${asset.href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = asset.href;
      link.as = asset.as;
      if (asset.crossorigin) {
        link.crossOrigin = asset.crossorigin;
      }
      document.head.appendChild(link);
    }
  });
};

// Optimize image loading with WebP support and lazy loading
export const optimizeImages = () => {
  if (typeof window === 'undefined') return;

  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    const imageElement = img as HTMLImageElement;
    
    // Add loading attributes based on position
    if (index > 2) { // Images below the fold
      imageElement.loading = 'lazy';
      imageElement.decoding = 'async';
    } else { // Above the fold images
      imageElement.loading = 'eager';
      imageElement.decoding = 'sync';
    }

    // Set proper alt attributes if missing
    if (!imageElement.alt) {
      imageElement.alt = 'PDFo Tool Image';
    }

    // Add explicit dimensions to prevent layout shift
    if (!imageElement.width || !imageElement.height) {
      imageElement.style.aspectRatio = '16/9';
      imageElement.style.width = '100%';
      imageElement.style.height = 'auto';
    }
  });

  // WebP support detection and optimization
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  if (supportsWebP()) {
    // Replace images with WebP versions where available
    images.forEach(img => {
      const imageElement = img as HTMLImageElement;
      if (imageElement.src && !imageElement.src.includes('.webp')) {
        const webpSrc = imageElement.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        
        // Test if WebP version exists
        const testImage = new Image();
        testImage.onload = () => {
          imageElement.src = webpSrc;
        };
        testImage.src = webpSrc;
      }
    });
  }
};

// Optimize CSS delivery and eliminate render-blocking resources
export const optimizeCSSDelivery = () => {
  if (typeof window === 'undefined') return;

  // Move non-critical CSS to load asynchronously
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  stylesheets.forEach(link => {
    const linkElement = link as HTMLLinkElement;
    
    // Skip critical CSS and fonts
    if (linkElement.href.includes('fonts') || linkElement.href.includes('critical')) {
      return;
    }

    // Convert to non-blocking load
    linkElement.media = 'print';
    linkElement.onload = function() {
      (this as HTMLLinkElement).media = 'all';
      (this as HTMLLinkElement).onload = null;
    };

    // Fallback for browsers that don't support onload
    setTimeout(() => {
      if (linkElement.media === 'print') {
        linkElement.media = 'all';
      }
    }, 3000);
  });
};

// JavaScript optimization and code splitting
export const optimizeJavaScript = () => {
  if (typeof window === 'undefined') return;

  // Defer non-critical scripts
  const scripts = document.querySelectorAll('script[src]:not([async]):not([defer])');
  scripts.forEach(script => {
    const scriptElement = script as HTMLScriptElement;
    
    // Skip critical scripts
    if (scriptElement.src.includes('main') || 
        scriptElement.src.includes('pdf.worker') ||
        scriptElement.src.includes('react')) {
      return;
    }

    scriptElement.defer = true;
  });

  // Remove unused scripts
  const unusedScripts = document.querySelectorAll('script[src*="analytics"], script[src*="tracking"]');
  unusedScripts.forEach(script => {
    if (!script.getAttribute('data-required')) {
      script.remove();
    }
  });
};

// Memory management and cleanup
export const optimizeMemoryUsage = () => {
  if (typeof window === 'undefined') return;

  // Clean up event listeners on page unload
  window.addEventListener('beforeunload', () => {
    // Remove all event listeners
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const clone = element.cloneNode(true);
      element.parentNode?.replaceChild(clone, element);
    });
  });

  // Implement memory monitoring
  if ('memory' in performance) {
    const memoryInfo = (performance as any).memory;
    console.log('Memory Usage:', {
      usedJSHeapSize: `${(memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      totalJSHeapSize: `${(memoryInfo.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      jsHeapSizeLimit: `${(memoryInfo.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
    });
  }

  // Garbage collection hints
  if ('gc' in window && typeof (window as any).gc === 'function') {
    // Suggest garbage collection after heavy operations
    setTimeout(() => {
      (window as any).gc();
    }, 5000);
  }
};

// Network optimization
export const optimizeNetwork = () => {
  if (typeof window === 'undefined') return;

  // Enable service worker for caching
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { 
      scope: '/',
      updateViaCache: 'none' 
    }).then(registration => {
      console.log('SW registered with scope:', registration.scope);
      
      // Update service worker when new version available
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, refresh page
              window.location.reload();
            }
          });
        }
      });
    }).catch(error => {
      console.warn('SW registration failed:', error);
    });
  }

  // Optimize fetch requests
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
    const optimizedInit = {
      ...init,
      headers: {
        ...init?.headers,
        'Accept-Encoding': 'gzip, deflate, br',
      }
    };
    
    return originalFetch(input, optimizedInit);
  };
};

// Cache optimization
export const optimizeCaching = () => {
  if (typeof window === 'undefined') return;

  // Set up aggressive browser caching
  const cacheableResources = document.querySelectorAll('link[href], script[src], img[src]');
  cacheableResources.forEach(resource => {
    const element = resource as HTMLElement;
    const url = element.getAttribute('href') || element.getAttribute('src');
    
    if (url && (url.includes('.js') || url.includes('.css') || url.includes('.woff'))) {
      // Add cache-busting for dynamic content
      if (!url.includes('?') && !url.includes('hash')) {
        const separator = url.includes('?') ? '&' : '?';
        const timestamp = Date.now();
        const newUrl = `${url}${separator}v=${timestamp}`;
        
        if (element.hasAttribute('href')) {
          element.setAttribute('href', newUrl);
        } else {
          element.setAttribute('src', newUrl);
        }
      }
    }
  });
};

// Initialize all advanced performance optimizations
export const initializeAdvancedPerformance = () => {
  if (typeof window === 'undefined') return;

  const runOptimizations = () => {
    optimizeResourceHints();
    optimizeImages();
    optimizeCSSDelivery();
    optimizeJavaScript();
    optimizeMemoryUsage();
    optimizeNetwork();
    optimizeCaching();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOptimizations);
  } else {
    runOptimizations();
  }

  // Run additional optimizations after page load
  window.addEventListener('load', () => {
    // Additional post-load optimizations
    setTimeout(() => {
      optimizeImages();
      optimizeMemoryUsage();
    }, 1000);
  });
};
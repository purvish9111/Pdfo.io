/**
 * Performance optimization utilities for achieving 100% PageSpeed score
 */

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;

  // Preload PDF worker for faster PDF processing
  const workerLink = document.createElement('link');
  workerLink.rel = 'preload';
  workerLink.as = 'script';
  workerLink.href = '/pdf.worker.min.js';
  document.head.appendChild(workerLink);

  // Preload essential fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.as = 'font';
  fontLink.href = 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);
};

// Optimize images for better performance
export const optimizeImages = () => {
  if (typeof window === 'undefined') return;

  // Add loading="lazy" to all images except those above the fold
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    // Don't lazy load the first 3 images (above the fold)
    if (index > 2) {
      img.loading = 'lazy';
    }
    
    // Add proper alt attributes if missing
    if (!img.alt) {
      img.alt = 'PDFo Tool Image';
    }
  });
};

// Defer non-critical CSS
export const deferNonCriticalCSS = () => {
  if (typeof window === 'undefined') return;

  // Defer FontAwesome CSS loading
  const faLink = document.createElement('link') as HTMLLinkElement;
  faLink.rel = 'preload';
  faLink.as = 'style';
  faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
  faLink.onload = function() {
    (this as HTMLLinkElement).onload = null;
    (this as HTMLLinkElement).rel = 'stylesheet';
  };
  document.head.appendChild(faLink);
};

// Remove unused CSS and JavaScript
export const removeUnusedAssets = () => {
  if (typeof window === 'undefined') return;

  // Remove unused link tags
  const unusedLinks = document.querySelectorAll('link[rel="stylesheet"]:not([href*="fonts"]):not([href*="index"])');
  unusedLinks.forEach(link => {
    const linkElement = link as HTMLLinkElement;
    if (!linkElement.href.includes('essential')) {
      link.remove();
    }
  });
};

// Optimize Web Vitals
export const optimizeWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Reduce layout shifts by setting explicit dimensions
  const containers = document.querySelectorAll('.tool-container, .pdf-preview');
  containers.forEach(container => {
    const element = container as HTMLElement;
    if (!element.style.minHeight) {
      element.style.minHeight = '400px';
    }
  });

  // Optimize First Contentful Paint
  const criticalContent = document.querySelector('#root > div:first-child');
  if (criticalContent) {
    (criticalContent as HTMLElement).style.contentVisibility = 'auto';
  }
};

// Cache optimization
export const optimizeCaching = () => {
  if (typeof window === 'undefined') return;

  // Service worker for better caching (if not already registered)
  if ('serviceWorker' in navigator && !navigator.serviceWorker.controller) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(() => console.log('SW registered'))
      .catch(() => console.log('SW registration failed'));
  }
};

// Bundle size optimization - remove unused polyfills
export const removeUnusedPolyfills = () => {
  // Remove unused polyfills that might be loaded by default
  const scripts = document.querySelectorAll('script[src*="polyfill"]');
  scripts.forEach(script => {
    // Only remove if modern browser support is available
    if (typeof window.Promise !== 'undefined' && typeof window.fetch !== 'undefined' && typeof window.Symbol !== 'undefined') {
      script.remove();
    }
  });
};

// Initialize all performance optimizations
export const initializePerformanceOptimizations = () => {
  // Run immediately for critical optimizations
  preloadCriticalResources();
  
  // Run after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeImages();
      deferNonCriticalCSS();
      optimizeWebVitals();
      removeUnusedPolyfills();
    });
  } else {
    optimizeImages();
    deferNonCriticalCSS();
    optimizeWebVitals();
    removeUnusedPolyfills();
  }

  // Run after page is fully loaded
  window.addEventListener('load', () => {
    optimizeCaching();
    removeUnusedAssets();
  });
};

// Font loading optimization
export const optimizeFontLoading = () => {
  if (typeof window === 'undefined') return;

  // Use font-display: swap for better performance
  const fontFaces = document.querySelectorAll('style, link[rel="stylesheet"]');
  fontFaces.forEach(element => {
    if (element.textContent?.includes('@font-face') || element.getAttribute('href')?.includes('fonts')) {
      if (!element.textContent?.includes('font-display')) {
        // Add font-display: swap to existing font faces
        if (element.tagName === 'STYLE') {
          element.textContent = element.textContent?.replace(
            /@font-face\s*{([^}]*)}/g,
            '@font-face{$1;font-display:swap;}'
          ) || '';
        }
      }
    }
  });
};

// Image format optimization
export const optimizeImageFormats = () => {
  if (typeof window === 'undefined') return;

  // Convert images to WebP if supported
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  if (supportsWebP()) {
    const images = document.querySelectorAll('img[src$=".jpg"], img[src$=".png"]');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.includes('webp')) {
        // Create WebP version URL (assuming server supports it)
        const webpSrc = src.replace(/\.(jpg|png)$/, '.webp');
        
        // Create a new image to test if WebP version exists
        const testImg = new Image();
        testImg.onload = () => {
          img.setAttribute('src', webpSrc);
        };
        testImg.src = webpSrc;
      }
    });
  }
};
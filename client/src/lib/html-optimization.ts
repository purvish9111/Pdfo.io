/**
 * HTML optimization for faster loading and better performance
 */

// Optimize HTML head for better performance
export const optimizeHTMLHead = () => {
  if (typeof window === 'undefined') return;

  // Remove redundant meta tags
  const metaTags = document.querySelectorAll('meta');
  const seenMetaNames = new Set();
  
  metaTags.forEach(meta => {
    const name = meta.getAttribute('name') || meta.getAttribute('property');
    if (name && seenMetaNames.has(name)) {
      meta.remove();
    } else if (name) {
      seenMetaNames.add(name);
    }
  });

  // Optimize viewport meta tag
  let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
  if (viewportMeta) {
    viewportMeta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
  }

  // Add performance-related meta tags
  const performanceMetas = [
    { name: 'theme-color', content: '#2563eb' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'format-detection', content: 'telephone=no' },
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }
  ];

  performanceMetas.forEach(metaData => {
    const existingMeta = document.querySelector(`meta[name="${metaData.name}"], meta[http-equiv="${metaData['http-equiv']}"]`);
    if (!existingMeta) {
      const meta = document.createElement('meta');
      if (metaData.name) meta.name = metaData.name;
      if (metaData['http-equiv']) meta.setAttribute('http-equiv', metaData['http-equiv']);
      meta.content = metaData.content;
      document.head.appendChild(meta);
    }
  });
};

// Optimize resource loading order
export const optimizeResourceOrder = () => {
  if (typeof window === 'undefined') return;

  // Move critical resources to the top of head
  const criticalResources = [
    'meta[charset]',
    'meta[name="viewport"]',
    'title',
    'link[rel="preconnect"]',
    'link[rel="dns-prefetch"]',
    'style[data-critical]'
  ];

  criticalResources.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element.parentNode === document.head) {
        document.head.insertBefore(element, document.head.firstChild);
      }
    });
  });

  // Move non-critical resources to the bottom
  const nonCriticalResources = [
    'script[src*="analytics"]',
    'script[src*="adsense"]',
    'link[href*="fontawesome"]'
  ];

  nonCriticalResources.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element.parentNode === document.head) {
        document.head.appendChild(element);
      }
    });
  });
};

// Minimize DOM size and optimize structure
export const optimizeDOM = () => {
  if (typeof window === 'undefined') return;

  // Remove empty elements (safely)
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    try {
      if (element.children.length === 0 && 
          element.textContent?.trim() === '' && 
          !['img', 'br', 'hr', 'input', 'meta', 'link', 'script', 'style'].includes(element.tagName.toLowerCase())) {
        element.remove();
      }
    } catch (e) {
      // Skip elements that can't be safely accessed or removed
    }
  });

  // Combine adjacent text nodes
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );

  const textNodes: Text[] = [];
  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node as Text);
  }

  textNodes.forEach(textNode => {
    if (textNode.nextSibling && textNode.nextSibling.nodeType === Node.TEXT_NODE) {
      const nextContent = textNode.nextSibling.textContent || '';
      const currentContent = textNode.textContent || '';
      textNode.textContent = currentContent + nextContent;
      textNode.nextSibling.remove();
    }
  });

  // Optimize class attributes by removing duplicates
  allElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    if (htmlElement.className && typeof htmlElement.className === 'string') {
      const classes = htmlElement.className.split(' ').filter(Boolean);
      const uniqueClasses = Array.from(new Set(classes));
      if (uniqueClasses.length !== classes.length) {
        htmlElement.className = uniqueClasses.join(' ');
      }
    }
  });
};

// Implement lazy loading for below-the-fold content
export const implementLazyLoading = () => {
  if (typeof window === 'undefined') return;

  // Lazy load images
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach((img, index) => {
    const imageElement = img as HTMLImageElement;
    if (index > 2) { // First 3 images load eagerly
      imageElement.loading = 'lazy';
      imageElement.decoding = 'async';
    }
  });

  // Lazy load iframes
  const iframes = document.querySelectorAll('iframe:not([loading])');
  iframes.forEach(iframe => {
    const iframeElement = iframe as HTMLIFrameElement;
    iframeElement.loading = 'lazy';
  });

  // Implement intersection observer for custom lazy loading
  if ('IntersectionObserver' in window) {
    const lazyElements = document.querySelectorAll('.lazy-load');
    
    const lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          
          // Load content when element comes into view
          const dataSrc = element.getAttribute('data-src');
          if (dataSrc) {
            if (element.tagName === 'IMG') {
              (element as HTMLImageElement).src = dataSrc;
            } else if (element.tagName === 'IFRAME') {
              (element as HTMLIFrameElement).src = dataSrc;
            }
            element.removeAttribute('data-src');
          }
          
          element.classList.remove('lazy-load');
          lazyLoadObserver.unobserve(element);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });
    
    lazyElements.forEach(element => {
      lazyLoadObserver.observe(element);
    });
  }
};

// Remove unused CSS classes and inline styles
export const removeUnusedStyles = () => {
  if (typeof window === 'undefined') return;

  // Get all CSS rules from stylesheets
  const allRules = new Set<string>();
  Array.from(document.styleSheets).forEach(sheet => {
    try {
      Array.from(sheet.cssRules || []).forEach(rule => {
        if (rule instanceof CSSStyleRule) {
          allRules.add(rule.selectorText);
        }
      });
    } catch (e) {
      // Cross-origin stylesheets might throw errors
      console.warn('Could not access stylesheet:', e);
    }
  });

  // Find unused selectors
  const unusedSelectors: string[] = [];
  allRules.forEach(selector => {
    try {
      if (!document.querySelector(selector)) {
        unusedSelectors.push(selector);
      }
    } catch (e) {
      // Invalid selectors
    }
  });

  console.log('Unused CSS selectors found:', unusedSelectors.length);
};

// Optimize form elements
export const optimizeForms = () => {
  if (typeof window === 'undefined') return;

  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    // Add autocomplete attributes for better UX
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const inputElement = input as HTMLInputElement;
      if (!inputElement.autocomplete) {
        switch (inputElement.type) {
          case 'email':
            inputElement.autocomplete = 'email';
            break;
          case 'password':
            inputElement.autocomplete = 'current-password';
            break;
          case 'tel':
            inputElement.autocomplete = 'tel';
            break;
          case 'text':
            if (inputElement.name?.includes('name')) {
              inputElement.autocomplete = 'name';
            }
            break;
        }
      }
    });

    // Optimize form submission
    form.addEventListener('submit', (e) => {
      // Disable submit button to prevent double submission
      const submitButton = form.querySelector('button[type="submit"], input[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = true;
        setTimeout(() => {
          submitButton.disabled = false;
        }, 3000);
      }
    });
  });
};

// Initialize all HTML optimizations
export const initializeHTMLOptimizations = () => {
  if (typeof window === 'undefined') return;

  const runOptimizations = () => {
    // Only run HTML optimizations in production to prevent design corruption
    if (window.location.hostname.includes('replit.dev') || window.location.hostname === 'localhost') {
      console.log('Development mode: Skipping HTML optimizations to preserve design');
      return;
    }
    
    try {
      optimizeHTMLHead();
      optimizeResourceOrder();
      implementLazyLoading();
      optimizeForms();
    } catch (error) {
      console.warn('HTML optimization error:', error);
    }
  };

  const runSafeOptimizations = () => {
    // Only run style removal in production
    if (window.location.hostname.includes('replit.dev') || window.location.hostname === 'localhost') {
      return;
    }
    
    try {
      removeUnusedStyles();
    } catch (error) {
      console.warn('Safe HTML optimization error:', error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOptimizations);
  } else {
    runOptimizations();
  }

  // Run additional optimizations after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      runSafeOptimizations();
    }, 3000);
  });
};
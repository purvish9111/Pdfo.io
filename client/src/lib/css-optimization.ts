/**
 * CSS optimization for better rendering performance and smaller bundle sizes
 */

// Inline critical CSS directly into the page
export const inlineCriticalCSS = () => {
  if (typeof window === 'undefined') return;

  const criticalCSS = `
    /* Reset and base styles */
    *, *::before, *::after { box-sizing: border-box; }
    html { line-height: 1.15; -webkit-text-size-adjust: 100%; }
    body { margin: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    
    /* Layout utilities */
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; }
    .min-h-screen { min-height: 100vh; }
    .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
    
    /* Typography */
    .text-center { text-align: center; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
    
    /* Colors */
    .text-gray-600 { color: #4b5563; }
    .text-blue-600 { color: #2563eb; }
    .bg-white { background-color: #ffffff; }
    .bg-blue-600 { background-color: #2563eb; }
    .text-white { color: #ffffff; }
    
    /* Spacing */
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-8 { margin-bottom: 2rem; }
    
    /* Interactive elements */
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none; transition: all 0.2s; border: none; cursor: pointer; }
    .btn-primary { background-color: #2563eb; color: #ffffff; }
    .btn-primary:hover { background-color: #1d4ed8; }
    
    /* Grid system */
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    
    /* Responsive design */
    @media (min-width: 640px) {
      .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    }
    
    @media (min-width: 768px) {
      .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
    
    @media (min-width: 1024px) {
      .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
    }
    
    /* Loading states */
    .loading { opacity: 0.7; pointer-events: none; }
    .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
    
    /* Custom properties for consistent theming */
    :root {
      --primary-color: #2563eb;
      --primary-hover: #1d4ed8;
      --text-primary: #111827;
      --text-secondary: #4b5563;
      --background: #ffffff;
      --border-color: #e5e7eb;
      --border-radius: 0.5rem;
      --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      :root {
        --text-primary: #f9fafb;
        --text-secondary: #d1d5db;
        --background: #111827;
        --border-color: #374151;
      }
      
      .dark\\:bg-gray-900 { background-color: #111827; }
      .dark\\:text-white { color: #f9fafb; }
      .dark\\:text-gray-300 { color: #d1d5db; }
      .dark\\:border-gray-700 { border-color: #374151; }
    }
  `;

  // Remove existing critical CSS
  const existingCritical = document.querySelector('#critical-css-optimized');
  if (existingCritical) existingCritical.remove();

  // Add optimized critical CSS
  const style = document.createElement('style');
  style.id = 'critical-css-optimized';
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
};

// Remove unused CSS variables
export const removeUnusedCSSVariables = () => {
  if (typeof window === 'undefined') return;

  const usedVariables = new Set<string>();
  const definedVariables = new Set<string>();

  // Find all CSS custom properties
  Array.from(document.styleSheets).forEach(sheet => {
    try {
      Array.from(sheet.cssRules || []).forEach(rule => {
        if (rule instanceof CSSStyleRule) {
          // Find defined variables
          Array.from(rule.style).forEach(property => {
            if (property.startsWith('--')) {
              definedVariables.add(property);
            }
          });
          
          // Find used variables
          const text = rule.cssText;
          const varMatches = text.match(/var\(([^)]+)\)/g);
          if (varMatches) {
            varMatches.forEach(match => {
              const varName = match.match(/var\(([^,)]+)/)?.[1]?.trim();
              if (varName) {
                usedVariables.add(varName);
              }
            });
          }
        }
      });
    } catch (e) {
      console.warn('Could not process stylesheet:', e);
    }
  });

  const unusedVariables = Array.from(definedVariables).filter(v => !usedVariables.has(v));
  console.log('Unused CSS variables:', unusedVariables.length);
};

// Optimize CSS delivery by deferring non-critical stylesheets
export const deferNonCriticalCSS = () => {
  if (typeof window === 'undefined') return;

  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  const criticalPatterns = [
    /fonts\.googleapis\.com/,
    /critical/i,
    /inline/i
  ];

  stylesheets.forEach(link => {
    const linkElement = link as HTMLLinkElement;
    const isCritical = criticalPatterns.some(pattern => pattern.test(linkElement.href));
    
    if (!isCritical) {
      // Defer non-critical CSS
      linkElement.media = 'print';
      linkElement.addEventListener('load', function() {
        this.media = 'all';
      });
      
      // Fallback for browsers that don't support the load event
      setTimeout(() => {
        if (linkElement.media === 'print') {
          linkElement.media = 'all';
        }
      }, 3000);
    }
  });
};

// Minify inline CSS
export const minifyInlineCSS = () => {
  if (typeof window === 'undefined') return;

  const styleElements = document.querySelectorAll('style');
  styleElements.forEach(style => {
    if (style.textContent) {
      const minified = style.textContent
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/;\s*}/g, '}') // Remove last semicolon before closing brace
        .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
        .replace(/\s*}\s*/g, '}') // Remove spaces around closing brace
        .replace(/;\s*/g, ';') // Remove spaces after semicolons
        .replace(/:\s*/g, ':') // Remove spaces after colons
        .trim();
      
      style.textContent = minified;
    }
  });
};

// Optimize font loading with font-display: swap
export const optimizeFontLoading = () => {
  if (typeof window === 'undefined') return;

  // Add font-display: swap to existing font-face rules
  const styleSheets = Array.from(document.styleSheets);
  styleSheets.forEach(sheet => {
    try {
      Array.from(sheet.cssRules || []).forEach(rule => {
        if (rule instanceof CSSFontFaceRule) {
          if (!(rule.style as any).fontDisplay) {
            (rule.style as any).fontDisplay = 'swap';
          }
        }
      });
    } catch (e) {
      console.warn('Could not modify font-face rules:', e);
    }
  });

  // Preload critical fonts
  const criticalFonts = [
    'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'
  ];

  criticalFonts.forEach(fontUrl => {
    if (!document.querySelector(`link[href="${fontUrl}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = fontUrl;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });
};

// Remove duplicate stylesheets
export const removeDuplicateStylesheets = () => {
  if (typeof window === 'undefined') return;

  const seenHrefs = new Set<string>();
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  
  stylesheets.forEach(link => {
    const linkElement = link as HTMLLinkElement;
    if (seenHrefs.has(linkElement.href)) {
      linkElement.remove();
    } else {
      seenHrefs.add(linkElement.href);
    }
  });
};

// Implement CSS containment for better performance
export const implementCSSContainment = () => {
  if (typeof window === 'undefined') return;

  // Add contain property to isolated components
  const components = document.querySelectorAll('.tool-card, .pdf-viewer, .modal, .sidebar');
  components.forEach(component => {
    const element = component as HTMLElement;
    element.style.contain = 'layout style paint';
  });

  // Add will-change property for elements that will be animated
  const animatedElements = document.querySelectorAll('.animate-pulse, .transition, [class*="hover:"]');
  animatedElements.forEach(element => {
    const el = element as HTMLElement;
    el.style.willChange = 'transform, opacity';
  });
};

// Initialize all CSS optimizations
export const initializeCSSOptimizations = () => {
  if (typeof window === 'undefined') return;

  const runOptimizations = () => {
    inlineCriticalCSS();
    deferNonCriticalCSS();
    minifyInlineCSS();
    optimizeFontLoading();
    removeDuplicateStylesheets();
    implementCSSContainment();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOptimizations);
  } else {
    runOptimizations();
  }

  // Run additional optimizations after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      removeUnusedCSSVariables();
      minifyInlineCSS();
    }, 2000);
  });
};
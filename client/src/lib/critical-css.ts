/**
 * Critical CSS injection for above-the-fold content
 * This ensures instant rendering of key UI elements
 */

export const injectCriticalCSS = () => {
  if (typeof window === 'undefined') return;

  // Remove existing critical CSS to allow updates
  const existing = document.querySelector('#critical-css');
  if (existing) existing.remove();

  const criticalCSS = `
    /* Critical CSS for above-the-fold content */
    
    /* Layout and containers */
    .min-h-screen { min-height: 100vh; }
    .bg-gray-50 { background-color: #f9fafb; }
    .dark .bg-gray-900 { background-color: #111827; }
    .max-w-7xl { max-width: 80rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
    
    /* Header */
    .bg-white { background-color: #ffffff; }
    .dark .bg-gray-800 { background-color: #1f2937; }
    .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
    .border-b { border-bottom-width: 1px; }
    .border-gray-200 { border-color: #e5e7eb; }
    .dark .border-gray-700 { border-color: #374151; }
    .h-16 { height: 4rem; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    
    /* Typography */
    .text-gray-600 { color: #4b5563; }
    .dark .text-gray-300 { color: #d1d5db; }
    .text-blue-600 { color: #2563eb; }
    .dark .text-blue-400 { color: #60a5fa; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-center { text-align: center; }
    
    /* Buttons */
    .bg-blue-600 { background-color: #2563eb; }
    .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
    .text-white { color: #ffffff; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .rounded-lg { border-radius: 0.5rem; }
    .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    
    /* Grid layout */
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .gap-6 { gap: 1.5rem; }
    .gap-8 { gap: 2rem; }
    
    /* Cards */
    .bg-card { background-color: hsl(var(--card)); }
    .text-card-foreground { color: hsl(var(--card-foreground)); }
    .rounded-xl { border-radius: 0.75rem; }
    .p-6 { padding: 1.5rem; }
    .hover\\:shadow-md:hover { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
    
    /* Hero section */
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mb-12 { margin-bottom: 3rem; }
    
    /* Loading states */
    .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .5; }
    }
    
    /* Critical font loading with proper font-weight range */
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 300 900;
      font-display: swap;
      src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2') format('woff2');
    }
    
    /* Responsive utilities */
    @media (min-width: 640px) {
      .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    
    @media (min-width: 768px) {
      .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .md\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
    }
    
    @media (min-width: 1024px) {
      .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
      .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
    
    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      .dark\\:bg-gray-900 { background-color: #111827; }
      .dark\\:bg-gray-800 { background-color: #1f2937; }
      .dark\\:text-gray-300 { color: #d1d5db; }
      .dark\\:text-blue-400 { color: #60a5fa; }
      .dark\\:border-gray-700 { border-color: #374151; }
    }
  `;

  const style = document.createElement('style');
  style.id = 'critical-css';
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
};

export const optimizeNonCriticalCSS = () => {
  if (typeof window === 'undefined') return;

  // Defer non-critical CSS
  const nonCriticalStyles = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
  nonCriticalStyles.forEach(link => {
    const linkElement = link as HTMLLinkElement;
    if (!linkElement.href.includes('fonts') && !linkElement.href.includes('critical')) {
      linkElement.media = 'print';
      linkElement.onload = function() {
        this.media = 'all';
        this.onload = null;
      };
    }
  });
};
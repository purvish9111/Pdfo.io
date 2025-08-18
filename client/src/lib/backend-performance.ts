/**
 * Backend-only performance optimizations that don't affect visual design
 * These optimizations work behind the scenes without changing the UI
 */

// Service Worker registration for caching (invisible to user)
export const registerServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registered with scope:', registration.scope);
    })
    .catch(error => {
      console.warn('SW registration failed:', error);
    });
};

// Memory usage monitoring (backend only)
export const monitorMemoryUsage = () => {
  if (typeof window === 'undefined' || !(performance as any).memory) return;

  const memory = (performance as any).memory;
  const memoryInfo = {
    usedJSHeapSize: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
    totalJSHeapSize: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
    jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + ' MB'
  };
  
  console.log('Memory Usage:', memoryInfo);
  
  // Monitor every 30 seconds
  setTimeout(monitorMemoryUsage, 30000);
};

// Resource timing monitoring (backend only)
export const monitorResourceTiming = () => {
  if (typeof window === 'undefined' || !performance.getEntriesByType) return;

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const bundles = resources.filter(resource => 
    resource.name.includes('.js') || resource.name.includes('.css')
  );

  bundles.forEach(bundle => {
    const size = bundle.transferSize ? (bundle.transferSize / 1024).toFixed(2) + 'KB' : '0.00KB';
    const name = bundle.name.split('/').pop() || bundle.name;
    console.log(`Bundle: ${name} - ${size}`);
  });
};

// Connection monitoring (backend only)
export const monitorNetworkConnection = () => {
  if (typeof window === 'undefined' || !('connection' in navigator)) return;

  const connection = (navigator as any).connection;
  if (connection) {
    console.log('Network:', {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink + ' Mbps',
      rtt: connection.rtt + ' ms'
    });
  }
};

// Initialize all backend performance monitoring
export const initializeBackendPerformance = () => {
  if (typeof window === 'undefined') return;

  // Register service worker for caching
  registerServiceWorker();
  
  // Start monitoring systems
  monitorMemoryUsage();
  monitorResourceTiming();
  monitorNetworkConnection();
  
  console.log('Backend performance monitoring initialized');
};
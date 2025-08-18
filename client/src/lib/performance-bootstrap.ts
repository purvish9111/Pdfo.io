/**
 * Performance bootstrap - Initialize all performance optimizations at startup
 */

import { initializeWebVitalsOptimizations } from "./web-vitals-optimization";
import { initializeBackendPerformance } from "./backend-performance";

export const initializeAllPerformanceOptimizations = () => {
  // COMPLETELY DISABLED: These optimizations corrupt the website design
  // The optimization scripts remove CSS variables and selectors that are needed
  // for responsive design, dark mode, and proper styling
  console.log('Performance optimizations DISABLED to preserve website design');
  return;
  
  // Backend monitoring only (invisible to user) - DISABLED
  // initializeWebVitalsOptimizations();
  // initializeBackendPerformance();
};
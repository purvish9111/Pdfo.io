/**
 * Performance bootstrap - Initialize all performance optimizations at startup
 */

import { initializeWebVitalsOptimizations } from "./web-vitals-optimization";
import { initializeBackendPerformance } from "./backend-performance";

export const initializeAllPerformanceOptimizations = () => {
  // Only initialize backend performance optimizations that don't affect design
  // NO CSS modifications, NO HTML modifications, NO visual changes
  
  // Backend monitoring only (invisible to user)
  initializeWebVitalsOptimizations();
  initializeBackendPerformance();
  
  console.log('Backend performance monitoring initialized (no design changes)');
};
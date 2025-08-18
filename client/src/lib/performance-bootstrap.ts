/**
 * Performance bootstrap - Initialize all performance optimizations at startup
 */

import { initializeWebVitalsOptimizations } from "./web-vitals-optimization";
import { injectCriticalCSS, optimizeNonCriticalCSS } from "./critical-css";
import { initializeAdvancedPerformance } from "./advanced-performance";
import { initializeHTMLOptimizations } from "./html-optimization";
import { initializeCSSOptimizations } from "./css-optimization";

export const initializeAllPerformanceOptimizations = () => {
  // Priority 1: Critical rendering path optimizations
  injectCriticalCSS();
  
  // Priority 2: Web Vitals and core performance metrics
  initializeWebVitalsOptimizations();
  
  // Priority 3: Advanced performance features
  initializeAdvancedPerformance();
  
  // Priority 4: HTML and CSS optimizations
  initializeHTMLOptimizations();
  initializeCSSOptimizations();
  
  // Priority 5: Deferred optimizations (non-critical)
  setTimeout(() => {
    optimizeNonCriticalCSS();
  }, 2000);
  
  console.log('🚀 All performance optimizations initialized');
};
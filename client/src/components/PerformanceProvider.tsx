/**
 * Performance provider component for global performance monitoring
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface PerformanceContextType {
  isSlowConnection: boolean;
  memoryUsage: {
    usedJSHeapSize: string;
    totalJSHeapSize: string;
    jsHeapSizeLimit: string;
  } | null;
  performanceScore: number;
  enableOptimizations: boolean;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

interface PerformanceProviderProps {
  children: ReactNode;
}

export const PerformanceProvider = ({ children }: PerformanceProviderProps) => {
  const [isSlowConnection, setIsSlowConnection] = React.useState(false);
  const [memoryUsage, setMemoryUsage] = React.useState<PerformanceContextType['memoryUsage']>(null);
  const [performanceScore, setPerformanceScore] = React.useState(100);
  const [enableOptimizations, setEnableOptimizations] = React.useState(false);

  React.useEffect(() => {
    // Detect connection speed
    const detectConnectionSpeed = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const slowTypes = ['slow-2g', '2g', '3g'];
        setIsSlowConnection(slowTypes.includes(connection.effectiveType));
      }
    };

    // Monitor memory usage
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usage = {
          usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
          totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
          jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
        };
        setMemoryUsage(usage);

        // Calculate performance score based on memory usage
        const memoryPercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        const score = Math.max(0, 100 - memoryPercent);
        setPerformanceScore(score);
      }
    };

    // Enable optimizations based on device capabilities
    const checkDeviceCapabilities = () => {
      const deviceMemory = (navigator as any).deviceMemory || 4; // Default to 4GB
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      
      // Enable optimizations for lower-end devices
      if (deviceMemory <= 2 || hardwareConcurrency <= 2) {
        setEnableOptimizations(true);
      }
    };

    detectConnectionSpeed();
    monitorMemory();
    checkDeviceCapabilities();

    // Set up intervals for continuous monitoring
    const connectionInterval = setInterval(detectConnectionSpeed, 30000); // Check every 30s
    const memoryInterval = setInterval(monitorMemory, 10000); // Check every 10s

    return () => {
      clearInterval(connectionInterval);
      clearInterval(memoryInterval);
    };
  }, []);

  const value: PerformanceContextType = {
    isSlowConnection,
    memoryUsage,
    performanceScore,
    enableOptimizations,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformanceContext = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformanceContext must be used within a PerformanceProvider');
  }
  return context;
};
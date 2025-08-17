/**
 * Backend optimization utilities for serverless deployment
 */

import type { Request, Response, NextFunction } from "express";
import { performance } from "perf_hooks";

// Performance monitoring middleware
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    
    // Log slow requests (>1000ms)
    if (duration > 1000) {
      console.warn(`🐌 Slow request: ${req.method} ${req.path} - ${duration.toFixed(2)}ms`);
    }
  });
  
  // Set performance headers before response starts
  res.set('X-Response-Time-Start', Date.now().toString());
  
  next();
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  const usage = process.memoryUsage();
  const formatBytes = (bytes: number) => (bytes / 1024 / 1024).toFixed(2) + ' MB';
  
  return {
    rss: formatBytes(usage.rss),
    heapTotal: formatBytes(usage.heapTotal),
    heapUsed: formatBytes(usage.heapUsed),
    external: formatBytes(usage.external),
    arrayBuffers: formatBytes(usage.arrayBuffers || 0),
  };
};

// Request rate limiting for API optimization
export const createRateLimiter = () => {
  const requests = new Map<string, { count: number; timestamp: number }>();
  const WINDOW_MS = 60000; // 1 minute
  const MAX_REQUESTS = 100; // 100 requests per minute per IP
  
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    // Clean old entries
    const entries = Array.from(requests.entries());
    for (const [key, value] of entries) {
      if (now - value.timestamp > WINDOW_MS) {
        requests.delete(key);
      }
    }
    
    const current = requests.get(ip) || { count: 0, timestamp: now };
    
    if (now - current.timestamp > WINDOW_MS) {
      current.count = 1;
      current.timestamp = now;
    } else {
      current.count++;
    }
    
    requests.set(ip, current);
    
    if (current.count > MAX_REQUESTS) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((WINDOW_MS - (now - current.timestamp)) / 1000),
      });
    }
    
    // Add rate limit headers (only if headers not sent)
    if (!res.headersSent) {
      res.set({
        'X-RateLimit-Limit': MAX_REQUESTS.toString(),
        'X-RateLimit-Remaining': Math.max(0, MAX_REQUESTS - current.count).toString(),
        'X-RateLimit-Reset': new Date(current.timestamp + WINDOW_MS).toISOString(),
      });
    }
    
    next();
  };
};

// Response compression for better performance
export const compressionConfig = {
  level: 6, // Balanced compression level
  threshold: 1024, // Only compress responses > 1KB
  filter: (req: Request, res: Response): boolean => {
    // Don't compress already compressed content
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // Compress text-based responses
    const contentType = res.get('Content-Type');
    return !!(contentType && (
      contentType.includes('text/') ||
      contentType.includes('application/json') ||
      contentType.includes('application/javascript') ||
      contentType.includes('application/xml')
    ));
  },
};

// Database connection optimization
export const optimizeDBConnection = () => {
  // Connection pooling settings for better performance
  return {
    maxConnections: 10,
    idleTimeout: 30000, // 30 seconds
    connectionTimeout: 5000, // 5 seconds
    acquireTimeout: 10000, // 10 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  };
};

// Caching headers for static assets
export const setCacheHeaders = (req: Request, res: Response, next: NextFunction) => {
  const url = req.url;
  
  // Long cache for static assets
  if (url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|pdf)$/)) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
  }
  // Short cache for API responses
  else if (url.startsWith('/api/')) {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  // No cache for HTML pages
  else {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  
  next();
};

// Error handling optimization
export const optimizedErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const start = performance.now();
  
  // Log error with context
  console.error('Server Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });
  
  // Return appropriate error response
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const errorResponse = {
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };
  
  // Add performance timing (only if headers not sent)
  const duration = performance.now() - start;
  if (!res.headersSent) {
    res.set('X-Error-Time', `${duration.toFixed(2)}ms`);
  }
  
  res.status(statusCode).json(errorResponse);
};

// Health check endpoint optimization
export const createHealthCheck = () => {
  return (req: Request, res: Response) => {
    const memoryUsage = monitorMemoryUsage();
    const uptime = process.uptime();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
      memory: memoryUsage,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    });
  };
};
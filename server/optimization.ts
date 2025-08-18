import { Request, Response, NextFunction } from 'express';
import compression from 'compression';

// Enhanced compression configuration for better performance
export const compressionConfig = {
  level: 9, // Maximum compression
  threshold: 1024, // Only compress files larger than 1KB
  filter: (req: Request, res: Response) => {
    // Don't compress if content-encoding is already set
    if (res.get('Content-Encoding')) {
      return false;
    }
    
    // Compress all text-based content
    return compression.filter(req, res);
  },
  chunkSize: 16 * 1024, // 16KB chunks for better streaming
};

// Cache headers optimization
export const setCacheHeaders = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  
  // Long-term caching for static assets
  if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    // Cache for 1 year
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // Medium-term caching for HTML pages
  else if (path.match(/\.html$/) || path === '/') {
    // Cache for 1 hour
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
  }
  // Short-term caching for API responses
  else if (path.startsWith('/api/')) {
    // Cache for 5 minutes
    res.setHeader('Cache-Control', 'public, max-age=300');
  }
  // PDF worker files - cache for 1 week
  else if (path.includes('pdf.worker') || path.includes('.worker.')) {
    res.setHeader('Cache-Control', 'public, max-age=604800');
  }
  
  // Additional performance headers (only set once)
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};

// Performance monitoring middleware
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Add response time calculation when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log slow requests (>1000ms) for optimization
    if (duration > 1000) {
      console.warn(`🐌 Slow request: ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  
  next();
};

// Rate limiting for better performance and security
export const createRateLimiter = () => {
  const requests = new Map<string, number[]>();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 100; // 100 requests per minute
    
    // Clean old entries
    const cutoff = now - windowMs;
    const entries = Array.from(requests.entries());
    for (const [key, timestamps] of entries) {
      const filtered = timestamps.filter((t: number) => t > cutoff);
      if (filtered.length === 0) {
        requests.delete(key);
      } else {
        requests.set(key, filtered);
      }
    }
    
    // Check current IP
    const ipRequests = requests.get(ip) || [];
    const recentRequests = ipRequests.filter((t: number) => t > cutoff);
    
    if (recentRequests.length >= maxRequests) {
      res.status(429).json({ error: 'Too many requests' });
      return;
    }
    
    // Add current request
    recentRequests.push(now);
    requests.set(ip, recentRequests);
    
    next();
  };
};

// Health check endpoint with performance metrics
export const createHealthCheck = () => {
  return (req: Request, res: Response) => {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
      },
      performance: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    });
  };
};

// Error handler optimization
export const optimizedErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log error but don't expose sensitive information
  console.error('Server error:', {
    path: req.path,
    method: req.method,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
  
  const status = err.status || err.statusCode || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;
  
  res.status(status).json({
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};

// Static file optimization
export const optimizeStaticFiles = (req: Request, res: Response, next: NextFunction) => {
  // Enable compression for all static files
  if (req.path.match(/\.(js|css|html|xml|txt|json)$/)) {
    res.set('Content-Encoding', 'gzip');
  }
  
  // Set optimal headers for static assets
  if (req.path.match(/\.(jpg|jpeg|png|gif|ico|svg)$/)) {
    res.set({
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Vary': 'Accept-Encoding',
    });
  }
  
  next();
};
/**
 * Optimized image component with lazy loading and WebP support
 */

import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  priority = false,
  placeholder,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(priority ? src : undefined);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setCurrentSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, priority, isInView]);

  // WebP format detection and fallback
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);

  useEffect(() => {
    // Check WebP support
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const isWebPSupported = canvas.toDataURL('image/webp').startsWith('data:image/webp');
    setSupportsWebP(isWebPSupported);
  }, []);

  // Generate optimized src URLs
  const getOptimizedSrc = (originalSrc: string) => {
    if (!supportsWebP) return originalSrc;
    
    // If it's already WebP, return as is
    if (originalSrc.includes('.webp')) return originalSrc;
    
    // Convert to WebP if possible (for static assets)
    const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return webpSrc;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    // Fallback to original format if WebP fails
    if (supportsWebP && currentSrc?.includes('.webp')) {
      setCurrentSrc(src);
    } else {
      onError?.();
    }
  };

  return (
    <div className={cn('relative overflow-hidden', className)} ref={imgRef}>
      {/* Placeholder while loading */}
      {!isLoaded && placeholder && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(placeholder)}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      
      {/* Main image */}
      {currentSrc && (
        <img
          {...props}
          src={supportsWebP !== null ? getOptimizedSrc(currentSrc) : currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
    </div>
  );
};
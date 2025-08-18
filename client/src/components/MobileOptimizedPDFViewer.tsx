import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileUtils, useMobileOptimization } from '@/lib/mobile-optimization';

interface MobileOptimizedPDFViewerProps {
  file: File;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  onClose?: () => void;
}

export function MobileOptimizedPDFViewer({ 
  file, 
  initialPage = 1, 
  onPageChange,
  onClose 
}: MobileOptimizedPDFViewerProps) {
  const { isMobile, isSmallScreen, viewport, shouldReduceAnimations } = useMobileOptimization();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch gesture handling
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [pinchDistance, setPinchDistance] = useState<number | null>(null);

  useEffect(() => {
    if (containerRef.current && isMobile) {
      // Prevent zoom on double tap
      MobileUtils.handleTouchEvents.preventZoom(containerRef.current);
    }
  }, [isMobile]);

  // Handle touch gestures for mobile navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    } else if (e.touches.length === 2) {
      // Pinch gesture for zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setPinchDistance(distance);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || e.touches.length > 0) return;

    const deltaX = e.changedTouches[0].clientX - touchStart.x;
    const deltaY = e.changedTouches[0].clientY - touchStart.y;
    const swipeThreshold = 50;

    // Horizontal swipe for page navigation
    if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaY) < swipeThreshold) {
      if (deltaX > 0 && currentPage > 1) {
        navigateToPage(currentPage - 1);
      } else if (deltaX < 0 && currentPage < totalPages) {
        navigateToPage(currentPage + 1);
      }
    }

    setTouchStart(null);
    setPinchDistance(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchDistance) {
      e.preventDefault();
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      const scaleChange = currentDistance / pinchDistance;
      const newZoom = Math.max(0.5, Math.min(3, zoom * scaleChange));
      setZoom(newZoom);
      setPinchDistance(currentDistance);
    }
  };

  const navigateToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange?.(page);
    }
  };

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.5, Math.min(3, zoom + delta));
    setZoom(newZoom);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleShare = async () => {
    if (navigator.share && isMobile) {
      try {
        await navigator.share({
          title: file.name,
          text: `PDF Document: ${file.name}`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to copy link
        await navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  // Optimized styles for mobile
  const containerStyles = isSmallScreen ? {
    height: '100vh',
    width: '100vw',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    zIndex: 1000,
    backgroundColor: '#000'
  } : {
    height: '600px',
    width: '100%',
    position: 'relative' as const,
    backgroundColor: '#f5f5f5'
  };

  const toolbarHeight = isSmallScreen ? '60px' : '50px';
  const spacing = MobileUtils.ui.getOptimalSpacing();

  return (
    <div 
      ref={containerRef}
      style={containerStyles}
      className="flex flex-col overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {/* Mobile-optimized toolbar */}
      <div 
        style={{ height: toolbarHeight }}
        className={`flex items-center justify-between bg-gray-900 text-white ${spacing.container}`}
      >
        <div className="flex items-center space-x-2">
          {onClose && (
            <Button
              variant="ghost"
              size={isSmallScreen ? "sm" : "default"}
              onClick={onClose}
              className="text-white hover:bg-gray-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <span className={`font-medium ${isSmallScreen ? 'text-sm' : 'text-base'} truncate`}>
            {file.name}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {/* Page navigation */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="text-white hover:bg-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm px-2">
            {currentPage} / {totalPages}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="text-white hover:bg-gray-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Zoom controls */}
          {!isSmallScreen && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleZoom(-0.25)}
                disabled={zoom <= 0.5}
                className="text-white hover:bg-gray-700"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-xs px-1">
                {Math.round(zoom * 100)}%
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleZoom(0.25)}
                disabled={zoom >= 3}
                className="text-white hover:bg-gray-700"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Mobile actions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRotate}
            className="text-white hover:bg-gray-700"
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-white hover:bg-gray-700"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* PDF viewer area */}
      <div className="flex-1 relative overflow-auto bg-gray-100 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-full p-4">
          <canvas
            ref={canvasRef}
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center',
              transition: shouldReduceAnimations ? 'none' : 'transform 0.2s ease-in-out',
              maxWidth: '100%',
              maxHeight: '100%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            className="border border-gray-300 dark:border-gray-600 bg-white"
          />
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <span className="text-sm">Loading PDF...</span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile-specific quick actions overlay */}
      {isSmallScreen && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-70 rounded-full px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleZoom(-0.25)}
            disabled={zoom <= 0.5}
            className="text-white hover:bg-gray-700 rounded-full"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleZoom(0.25)}
            disabled={zoom >= 3}
            className="text-white hover:bg-gray-700 rounded-full"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
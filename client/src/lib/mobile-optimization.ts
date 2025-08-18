// Mobile optimization utilities and responsive design helpers

export const MobileUtils = {
  // Detect mobile device
  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Detect touch device
  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // Get viewport dimensions
  getViewport(): { width: number; height: number } {
    return {
      width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
  },

  // Check if screen is small (mobile/tablet)
  isSmallScreen(): boolean {
    const { width } = this.getViewport();
    return width <= 768; // Tailwind's md breakpoint
  },

  // Optimize file upload for mobile
  optimizeFileUpload(options: {
    maxFileSize?: number;
    allowedTypes?: string[];
    showCompression?: boolean;
  }) {
    const defaults = {
      maxFileSize: this.isMobile() ? 25 * 1024 * 1024 : 50 * 1024 * 1024, // 25MB mobile, 50MB desktop
      allowedTypes: ['application/pdf'],
      showCompression: this.isMobile()
    };

    return { ...defaults, ...options };
  },

  // Handle mobile-specific touch events
  handleTouchEvents: {
    // Prevent zoom on double tap for specific elements
    preventZoom(element: HTMLElement) {
      element.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      });

      let lastTouchEnd = 0;
      element.addEventListener('touchend', function(e) {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      }, false);
    },

    // Optimize drag and drop for touch
    enableTouchDrag(element: HTMLElement, onMove: (x: number, y: number) => void) {
      let isDragging = false;
      let startX = 0;
      let startY = 0;

      element.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
      });

      element.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        
        onMove(deltaX, deltaY);
      });

      element.addEventListener('touchend', () => {
        isDragging = false;
      });
    }
  },

  // Performance optimizations for mobile
  performance: {
    // Reduce animations on low-end devices
    shouldReduceAnimations(): boolean {
      // Check for reduced motion preference
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return true;
      }

      // Reduce animations on slower devices
      const connectionSpeed = (navigator as any).connection?.effectiveType;
      return connectionSpeed === 'slow-2g' || connectionSpeed === '2g';
    },

    // Optimize image rendering for mobile
    optimizeImageRendering(canvas: HTMLCanvasElement): void {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Use lower quality for mobile to improve performance
        ctx.imageSmoothingEnabled = !this.shouldReduceAnimations();
        ctx.imageSmoothingQuality = this.shouldReduceAnimations() ? 'low' : 'high';
      }
    },

    // Debounce function for mobile input
    debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
      let timeout: NodeJS.Timeout;
      return ((...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      }) as T;
    }
  },

  // UI adjustments for mobile
  ui: {
    // Get optimal grid columns for mobile
    getOptimalGridColumns(): number {
      const { width } = MobileUtils.getViewport();
      if (width < 480) return 1; // xs screens
      if (width < 768) return 2; // sm screens
      if (width < 1024) return 3; // md screens
      return 4; // lg+ screens
    },

    // Get optimal font sizes for mobile
    getOptimalFontSizes() {
      const isMobile = MobileUtils.isSmallScreen();
      return {
        heading: isMobile ? 'text-2xl' : 'text-3xl',
        subheading: isMobile ? 'text-lg' : 'text-xl',
        body: isMobile ? 'text-sm' : 'text-base',
        caption: isMobile ? 'text-xs' : 'text-sm'
      };
    },

    // Get optimal spacing for mobile
    getOptimalSpacing() {
      const isMobile = MobileUtils.isSmallScreen();
      return {
        container: isMobile ? 'px-4' : 'px-6',
        section: isMobile ? 'py-8' : 'py-12',
        card: isMobile ? 'p-4' : 'p-6',
        button: isMobile ? 'px-4 py-2' : 'px-6 py-3'
      };
    }
  },

  // Accessibility improvements for mobile
  accessibility: {
    // Improve tap targets for mobile
    improveTapTargets(element: HTMLElement) {
      const minTapSize = 44; // iOS HIG recommendation
      const rect = element.getBoundingClientRect();
      
      if (rect.width < minTapSize || rect.height < minTapSize) {
        element.style.minWidth = `${minTapSize}px`;
        element.style.minHeight = `${minTapSize}px`;
        element.style.display = 'flex';
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
      }
    },

    // Add mobile-friendly focus indicators
    addMobileFocus(element: HTMLElement) {
      element.style.outlineOffset = '2px';
      element.addEventListener('focus', () => {
        element.style.outline = '2px solid #3b82f6';
      });
      element.addEventListener('blur', () => {
        element.style.outline = 'none';
      });
    }
  }
};

// React hook for mobile optimization
export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = React.useState(MobileUtils.isMobile());
  const [isSmallScreen, setIsSmallScreen] = React.useState(MobileUtils.isSmallScreen());

  React.useEffect(() => {
    const handleResize = MobileUtils.performance.debounce(() => {
      setIsSmallScreen(MobileUtils.isSmallScreen());
    }, 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile,
    isSmallScreen,
    isTouchDevice: MobileUtils.isTouchDevice(),
    viewport: MobileUtils.getViewport(),
    gridColumns: MobileUtils.ui.getOptimalGridColumns(),
    fontSizes: MobileUtils.ui.getOptimalFontSizes(),
    spacing: MobileUtils.ui.getOptimalSpacing(),
    shouldReduceAnimations: MobileUtils.performance.shouldReduceAnimations()
  };
};

// Add React import for the hook
import React from 'react';
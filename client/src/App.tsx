import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/hooks/use-auth";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { PerformanceProvider } from "@/components/PerformanceProvider";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import { initializePDFJS } from "./lib/pdf-worker-config";
import { initializePerformanceMonitoring } from "./lib/performance-monitor";
// DISABLED: File deleted to prevent CSS corruption
// import { initializeWebVitalsOptimizations } from "./lib/web-vitals-optimization";
// DISABLED: These imports cause CSS corruption
// import { injectCriticalCSS, optimizeNonCriticalCSS } from "./lib/critical-css";
// import { initializeAllPerformanceOptimizations } from "./lib/performance-bootstrap";
// Use lazy loading for better bundle optimization - reduces main bundle size
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/not-found";

// Lazy load PDF tools for bundle optimization
const Login = lazy(() => import("@/pages/Login"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const MergePDF = lazy(() => import("@/pages/MergePDF"));
const SplitPDF = lazy(() => import("@/pages/SplitPDF"));
const ReorderPages = lazy(() => import("@/pages/ReorderPages"));
const DeletePages = lazy(() => import("@/pages/DeletePages"));
const RotatePDF = lazy(() => import("@/pages/RotatePDF"));
const PageNumbers = lazy(() => import("@/pages/PageNumbers"));
const EditMetadata = lazy(() => import("@/pages/EditMetadata"));
const WatermarkPDF = lazy(() => import("@/pages/WatermarkPDF"));
const LockPDF = lazy(() => import("@/pages/LockPDF"));
const UnlockPDF = lazy(() => import("@/pages/UnlockPDF"));
const CompressPDF = lazy(() => import("@/pages/CompressPDF"));
const ExtractImages = lazy(() => import("@/pages/ExtractImages"));
const OptimizePDF = lazy(() => import("@/pages/OptimizePDF"));
const RemoveBlankPages = lazy(() => import("@/pages/RemoveBlankPages"));
const AddHeaderFooter = lazy(() => import("@/pages/AddHeaderFooter"));
const PDFToJPG = lazy(() => import("@/pages/PDFToJPG"));
const PDFToPNG = lazy(() => import("@/pages/PDFToPNG"));
const PDFToTIFF = lazy(() => import("@/pages/PDFToTIFF"));
const PDFToWord = lazy(() => import("@/pages/PDFToWord"));
const PDFToExcel = lazy(() => import("@/pages/PDFToExcel"));
const PDFToPPT = lazy(() => import("@/pages/PDFToPPT"));
const PDFToTXT = lazy(() => import("@/pages/PDFToTXT"));
const PDFToJSON = lazy(() => import("@/pages/PDFToJSON"));
const PNGToPDF = lazy(() => import("@/pages/PNGToPDF"));
const WordToPDF = lazy(() => import("@/pages/WordToPDF"));
const ExcelToPDF = lazy(() => import("@/pages/ExcelToPDF"));

// Other Tools - Non-PDF Tools
const ImageCompressor = lazy(() => import("@/pages/ImageCompressor"));
const URLShortener = lazy(() => import("@/pages/URLShortener"));
const QRGenerator = lazy(() => import("@/pages/QRGenerator"));
const PasswordGenerator = lazy(() => import("@/pages/PasswordGenerator"));
const ColorPalette = lazy(() => import("@/pages/ColorPalette"));
const UnitConverter = lazy(() => import("@/pages/UnitConverter"));
const HashGenerator = lazy(() => import("@/pages/HashGenerator"));

// Loading component for lazy routes
const LazyLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-sm text-gray-600 dark:text-gray-400">Loading tool...</p>
    </div>
  </div>
);
// FIXED: Removed unused LazyRoute import causing errors
// import { LazyRoute } from "@/components/LazyRoute";

function Router() {
  const [location] = useLocation();
  
  // Track page views when routes change
  useAnalytics();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location]);
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* Authentication Routes - Lazy Loaded */}
      <Route path="/login" component={() => <Suspense fallback={<LazyLoader />}><Login /></Suspense>} />
      <Route path="/signup" component={() => <Suspense fallback={<LazyLoader />}><SignUp /></Suspense>} />
      <Route path="/auth" component={() => <Suspense fallback={<LazyLoader />}><Login /></Suspense>} />
      
      {/* PDF Manipulation Tools - Lazy Loaded for Bundle Optimization */}
      <Route path="/merge" component={() => <Suspense fallback={<LazyLoader />}><MergePDF /></Suspense>} />
      <Route path="/split" component={() => <Suspense fallback={<LazyLoader />}><SplitPDF /></Suspense>} />
      <Route path="/reorder" component={() => <Suspense fallback={<LazyLoader />}><ReorderPages /></Suspense>} />
      <Route path="/delete" component={() => <Suspense fallback={<LazyLoader />}><DeletePages /></Suspense>} />
      <Route path="/rotate" component={() => <Suspense fallback={<LazyLoader />}><RotatePDF /></Suspense>} />
      <Route path="/page-numbers" component={() => <Suspense fallback={<LazyLoader />}><PageNumbers /></Suspense>} />
      
      {/* Advanced Tools - Lazy Loaded for Bundle Optimization */}
      <Route path="/edit-metadata" component={() => <Suspense fallback={<LazyLoader />}><EditMetadata /></Suspense>} />
      <Route path="/watermark-pdf" component={() => <Suspense fallback={<LazyLoader />}><WatermarkPDF /></Suspense>} />
      <Route path="/lock-pdf" component={() => <Suspense fallback={<LazyLoader />}><LockPDF /></Suspense>} />
      <Route path="/unlock-pdf" component={() => <Suspense fallback={<LazyLoader />}><UnlockPDF /></Suspense>} />
      <Route path="/compress-pdf" component={() => <Suspense fallback={<LazyLoader />}><CompressPDF /></Suspense>} />
      <Route path="/extract-images" component={() => <Suspense fallback={<LazyLoader />}><ExtractImages /></Suspense>} />
      <Route path="/optimize-pdf" component={() => <Suspense fallback={<LazyLoader />}><OptimizePDF /></Suspense>} />
      <Route path="/remove-blank-pages" component={() => <Suspense fallback={<LazyLoader />}><RemoveBlankPages /></Suspense>} />
      <Route path="/add-header-footer" component={() => <Suspense fallback={<LazyLoader />}><AddHeaderFooter /></Suspense>} />
      
      {/* PDF Conversion Tools - Lazy Loaded for Bundle Optimization */}
      <Route path="/pdf-to-jpg" component={() => <Suspense fallback={<LazyLoader />}><PDFToJPG /></Suspense>} />
      <Route path="/pdf-to-png" component={() => <Suspense fallback={<LazyLoader />}><PDFToPNG /></Suspense>} />
      <Route path="/pdf-to-tiff" component={() => <Suspense fallback={<LazyLoader />}><PDFToTIFF /></Suspense>} />
      <Route path="/pdf-to-word" component={() => <Suspense fallback={<LazyLoader />}><PDFToWord /></Suspense>} />
      <Route path="/pdf-to-excel" component={() => <Suspense fallback={<LazyLoader />}><PDFToExcel /></Suspense>} />
      <Route path="/pdf-to-ppt" component={() => <Suspense fallback={<LazyLoader />}><PDFToPPT /></Suspense>} />
      <Route path="/pdf-to-txt" component={() => <Suspense fallback={<LazyLoader />}><PDFToTXT /></Suspense>} />
      <Route path="/pdf-to-json" component={() => <Suspense fallback={<LazyLoader />}><PDFToJSON /></Suspense>} />
      
      {/* Reverse Conversion Tools - Lazy Loaded for Bundle Optimization */}
      <Route path="/png-to-pdf" component={() => <Suspense fallback={<LazyLoader />}><PNGToPDF /></Suspense>} />
      <Route path="/word-to-pdf" component={() => <Suspense fallback={<LazyLoader />}><WordToPDF /></Suspense>} />
      <Route path="/excel-to-pdf" component={() => <Suspense fallback={<LazyLoader />}><ExcelToPDF /></Suspense>} />
      
      {/* Other Tools - Non-PDF Tools */}
      <Route path="/image-compressor" component={() => <Suspense fallback={<LazyLoader />}><ImageCompressor /></Suspense>} />
      <Route path="/url-shortener" component={() => <Suspense fallback={<LazyLoader />}><URLShortener /></Suspense>} />
      <Route path="/qr-generator" component={() => <Suspense fallback={<LazyLoader />}><QRGenerator /></Suspense>} />
      <Route path="/password-generator" component={() => <Suspense fallback={<LazyLoader />}><PasswordGenerator /></Suspense>} />
      <Route path="/color-palette" component={() => <Suspense fallback={<LazyLoader />}><ColorPalette /></Suspense>} />
      <Route path="/unit-converter" component={() => <Suspense fallback={<LazyLoader />}><UnitConverter /></Suspense>} />
      <Route path="/hash-generator" component={() => <Suspense fallback={<LazyLoader />}><HashGenerator /></Suspense>} />
      
      {/* Company Pages */}
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />

      <Route path="/dashboard" component={() => <Suspense fallback={<LazyLoader />}><Dashboard /></Suspense>} />
      <Route path="/:rest*" component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize all optimizations and analytics
  useEffect(() => {
    // Initialize Google Analytics
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
    
    // Initialize PDF.js worker for better performance
    initializePDFJS();
    
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    
    // DISABLED: Optimization scripts corrupt CSS classes and design
    // These scripts remove h-8, w-8, object-contain and other needed classes
    // initializeAllPerformanceOptimizations();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Header />
              <main>
                <Router />
              </main>
            </div>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

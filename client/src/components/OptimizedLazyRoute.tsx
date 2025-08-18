import { Suspense, lazy, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyRouteProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
}

// Optimized loading component
const OptimizedLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-sm text-gray-600 dark:text-gray-400">Loading tool...</p>
    </div>
  </div>
);

export function OptimizedLazyRoute({ component, fallback = <OptimizedLoader /> }: LazyRouteProps) {
  const LazyComponent = lazy(component);
  
  return (
    <Suspense fallback={fallback}>
      <LazyComponent />
    </Suspense>
  );
}

// Pre-optimized lazy imports with webpack magic comments for better chunking
export const lazyRoutes = {
  Home: () => import(/* webpackChunkName: "home" */ '@/pages/Home'),
  Login: () => import(/* webpackChunkName: "auth" */ '@/pages/Login'),
  SignUp: () => import(/* webpackChunkName: "auth" */ '@/pages/SignUp'),
  
  // PDF Manipulation Tools - grouped together
  MergePDF: () => import(/* webpackChunkName: "pdf-manipulation" */ '@/pages/MergePDF'),
  SplitPDF: () => import(/* webpackChunkName: "pdf-manipulation" */ '@/pages/SplitPDF'),
  ReorderPages: () => import(/* webpackChunkName: "pdf-manipulation" */ '@/pages/ReorderPages'),
  DeletePages: () => import(/* webpackChunkName: "pdf-manipulation" */ '@/pages/DeletePages'),
  RotatePDF: () => import(/* webpackChunkName: "pdf-manipulation" */ '@/pages/RotatePDF'),
  PageNumbers: () => import(/* webpackChunkName: "pdf-manipulation" */ '@/pages/PageNumbers'),
  
  // PDF Security Tools - grouped together
  LockPDF: () => import(/* webpackChunkName: "pdf-security" */ '@/pages/LockPDF'),
  UnlockPDF: () => import(/* webpackChunkName: "pdf-security" */ '@/pages/UnlockPDF'),
  WatermarkPDF: () => import(/* webpackChunkName: "pdf-security" */ '@/pages/WatermarkPDF'),
  
  // PDF Optimization Tools
  CompressPDF: () => import(/* webpackChunkName: "pdf-optimization" */ '@/pages/CompressPDF'),
  EditMetadata: () => import(/* webpackChunkName: "pdf-optimization" */ '@/pages/EditMetadata'),
  OptimizePDF: () => import(/* webpackChunkName: "pdf-optimization" */ '@/pages/OptimizePDF'),
  RemoveBlankPages: () => import(/* webpackChunkName: "pdf-optimization" */ '@/pages/RemoveBlankPages'),
  
  // PDF Conversion From PDF - grouped together
  PDFToJPG: () => import(/* webpackChunkName: "pdf-conversion-from" */ '@/pages/PDFToJPG'),
  PDFToPNG: () => import(/* webpackChunkName: "pdf-conversion-from" */ '@/pages/PDFToPNG'),
  PDFToTIFF: () => import(/* webpackChunkName: "pdf-conversion-from" */ '@/pages/PDFToTIFF'),
  PDFToWord: () => import(/* webpackChunkName: "pdf-conversion-from" */ '@/pages/PDFToWord'),
  PDFToExcel: () => import(/* webpackChunkName: "pdf-conversion-from" */ '@/pages/PDFToExcel'),
  PDFToPPT: () => import(/* webpackChunkName: "pdf-conversion-from" */ '@/pages/PDFToPPT'),
  PDFToTXT: () => import(/* webpackChunkName: "pdf-conversion-from" */ '@/pages/PDFToTXT'),
  PDFToJSON: () => import(/* webpackChunkName: "pdf-conversion-from" */ '@/pages/PDFToJSON'),
  
  // PDF Conversion To PDF - grouped together  
  PNGToPDF: () => import(/* webpackChunkName: "pdf-conversion-to" */ '@/pages/PNGToPDF'),
  WordToPDF: () => import(/* webpackChunkName: "pdf-conversion-to" */ '@/pages/WordToPDF'),
  ExcelToPDF: () => import(/* webpackChunkName: "pdf-conversion-to" */ '@/pages/ExcelToPDF'),
  
  // Advanced PDF Tools
  ExtractImages: () => import(/* webpackChunkName: "pdf-advanced" */ '@/pages/ExtractImages'),
  AddHeaderFooter: () => import(/* webpackChunkName: "pdf-advanced" */ '@/pages/AddHeaderFooter'),
  
  // Static Pages - grouped together
  About: () => import(/* webpackChunkName: "static-pages" */ '@/pages/About'),
  Privacy: () => import(/* webpackChunkName: "static-pages" */ '@/pages/Privacy'),
  Terms: () => import(/* webpackChunkName: "static-pages" */ '@/pages/Terms'),
  Contact: () => import(/* webpackChunkName: "static-pages" */ '@/pages/Contact'),
  NotFound: () => import(/* webpackChunkName: "static-pages" */ '@/pages/not-found'),
};
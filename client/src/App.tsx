import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/hooks/use-auth";
import { LazyRoute } from "@/components/LazyRoute";
import { PerformanceProvider } from "@/components/PerformanceProvider";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import { initializePDFJS } from "./lib/pdf-worker-config";
import { initializePerformanceMonitoring } from "./lib/performance-monitor";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import MergePDF from "@/pages/MergePDF";
import SplitPDF from "@/pages/SplitPDF";
import ReorderPages from "@/pages/ReorderPages";
import DeletePages from "@/pages/DeletePages";
import RotatePDF from "@/pages/RotatePDF";
import PageNumbers from "@/pages/PageNumbers";
import EditMetadata from "@/pages/EditMetadata";
import WatermarkPDF from "@/pages/WatermarkPDF";
import LockPDF from "@/pages/LockPDF";
import UnlockPDF from "@/pages/UnlockPDF";
import CompressPDF from "@/pages/CompressPDF";
import PDFToJPG from "@/pages/PDFToJPG";
import PDFToPNG from "@/pages/PDFToPNG";
import PDFToTIFF from "@/pages/PDFToTIFF";
import PDFToWord from "@/pages/PDFToWord";
import PDFToExcel from "@/pages/PDFToExcel";
import PDFToPPT from "@/pages/PDFToPPT";
import PDFToTXT from "@/pages/PDFToTXT";
import PDFToJSON from "@/pages/PDFToJSON";
import PNGToPDF from "@/pages/PNGToPDF";
import WordToPDF from "@/pages/WordToPDF";
import ExcelToPDF from "@/pages/ExcelToPDF";
import About from "@/pages/About";

import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";

import NotFound from "@/pages/not-found";

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* Authentication Routes */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      
      {/* PDF Manipulation Tools - Lazy Loaded */}
      <Route path="/merge">
        <LazyRoute factory={() => import("@/pages/MergePDF")} />
      </Route>
      <Route path="/split">
        <LazyRoute factory={() => import("@/pages/SplitPDF")} />
      </Route>
      <Route path="/reorder">
        <LazyRoute factory={() => import("@/pages/ReorderPages")} />
      </Route>
      <Route path="/delete">
        <LazyRoute factory={() => import("@/pages/DeletePages")} />
      </Route>
      <Route path="/rotate">
        <LazyRoute factory={() => import("@/pages/RotatePDF")} />
      </Route>
      <Route path="/page-numbers">
        <LazyRoute factory={() => import("@/pages/PageNumbers")} />
      </Route>
      
      {/* Advanced Tools - Lazy Loaded */}
      <Route path="/edit-metadata">
        <LazyRoute factory={() => import("@/pages/EditMetadata")} />
      </Route>
      <Route path="/watermark-pdf">
        <LazyRoute factory={() => import("@/pages/WatermarkPDF")} />
      </Route>
      <Route path="/lock-pdf">
        <LazyRoute factory={() => import("@/pages/LockPDF")} />
      </Route>
      <Route path="/unlock-pdf">
        <LazyRoute factory={() => import("@/pages/UnlockPDF")} />
      </Route>
      <Route path="/compress-pdf">
        <LazyRoute factory={() => import("@/pages/CompressPDF")} />
      </Route>
      
      {/* PDF Conversion Tools - Lazy Loaded */}
      <Route path="/pdf-to-jpg">
        <LazyRoute factory={() => import("@/pages/PDFToJPG")} />
      </Route>
      <Route path="/pdf-to-png">
        <LazyRoute factory={() => import("@/pages/PDFToPNG")} />
      </Route>
      <Route path="/pdf-to-tiff">
        <LazyRoute factory={() => import("@/pages/PDFToTIFF")} />
      </Route>
      <Route path="/pdf-to-word">
        <LazyRoute factory={() => import("@/pages/PDFToWord")} />
      </Route>
      <Route path="/pdf-to-excel">
        <LazyRoute factory={() => import("@/pages/PDFToExcel")} />
      </Route>
      <Route path="/pdf-to-ppt">
        <LazyRoute factory={() => import("@/pages/PDFToPPT")} />
      </Route>
      <Route path="/pdf-to-txt">
        <LazyRoute factory={() => import("@/pages/PDFToTXT")} />
      </Route>
      <Route path="/pdf-to-json">
        <LazyRoute factory={() => import("@/pages/PDFToJSON")} />
      </Route>
      
      {/* Reverse Conversion Tools - Lazy Loaded */}
      <Route path="/png-to-pdf">
        <LazyRoute factory={() => import("@/pages/PNGToPDF")} />
      </Route>
      <Route path="/word-to-pdf">
        <LazyRoute factory={() => import("@/pages/WordToPDF")} />
      </Route>
      <Route path="/excel-to-pdf">
        <LazyRoute factory={() => import("@/pages/ExcelToPDF")} />
      </Route>
      
      {/* Company Pages */}
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />

      <Route path="/dashboard">
        <LazyRoute factory={() => import("@/pages/Dashboard")} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize all performance optimizations and analytics
  useEffect(() => {
    // Initialize PDF.js worker for better performance
    initializePDFJS();
    
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    
    // Initialize Google Analytics
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PerformanceProvider>
        <AuthProvider>
          <ThemeProvider>
            <TooltipProvider>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <main>
                  <Router />
                </main>
              </div>
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </PerformanceProvider>
    </QueryClientProvider>
  );
}

export default App;

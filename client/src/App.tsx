import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/hooks/use-auth";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
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
import PDFPreviewDemo from "@/pages/PDFPreviewDemo";
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
      
      {/* PDF Manipulation Tools */}
      <Route path="/merge" component={MergePDF} />
      <Route path="/split" component={SplitPDF} />
      <Route path="/reorder" component={ReorderPages} />
      <Route path="/delete" component={DeletePages} />
      <Route path="/rotate" component={RotatePDF} />
      <Route path="/page-numbers" component={PageNumbers} />
      
      {/* Advanced Tools */}
      <Route path="/edit-metadata" component={EditMetadata} />
      <Route path="/watermark-pdf" component={WatermarkPDF} />
      <Route path="/lock-pdf" component={LockPDF} />
      <Route path="/unlock-pdf" component={UnlockPDF} />
      <Route path="/compress-pdf" component={CompressPDF} />
      
      {/* PDF Conversion Tools */}
      <Route path="/pdf-to-jpg" component={PDFToJPG} />
      <Route path="/pdf-to-png" component={PDFToPNG} />
      <Route path="/pdf-to-tiff" component={PDFToTIFF} />
      <Route path="/pdf-to-word" component={PDFToWord} />
      <Route path="/pdf-to-excel" component={PDFToExcel} />
      <Route path="/pdf-to-ppt" component={PDFToPPT} />
      <Route path="/pdf-to-txt" component={PDFToTXT} />
      <Route path="/pdf-to-json" component={PDFToJSON} />
      
      {/* Reverse Conversion Tools */}
      <Route path="/png-to-pdf" component={PNGToPDF} />
      <Route path="/word-to-pdf" component={WordToPDF} />
      <Route path="/excel-to-pdf" component={ExcelToPDF} />
      
      {/* Company Pages */}
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />
      <Route path="/pdf-preview-demo" component={PDFPreviewDemo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;

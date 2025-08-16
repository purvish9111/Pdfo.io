import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import Home from "@/pages/Home";
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
import PDFPreviewDemo from "@/pages/PDFPreviewDemo";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/merge" component={MergePDF} />
      <Route path="/split" component={SplitPDF} />
      <Route path="/reorder" component={ReorderPages} />
      <Route path="/delete" component={DeletePages} />
      <Route path="/rotate" component={RotatePDF} />
      <Route path="/page-numbers" component={PageNumbers} />
      <Route path="/edit-metadata" component={EditMetadata} />
      <Route path="/watermark-pdf" component={WatermarkPDF} />
      <Route path="/lock-pdf" component={LockPDF} />
      <Route path="/unlock-pdf" component={UnlockPDF} />
      <Route path="/compress-pdf" component={CompressPDF} />
      <Route path="/pdf-preview-demo" component={PDFPreviewDemo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;

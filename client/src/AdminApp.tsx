import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import AdminDashboard from "@/pages/AdminDashboard";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import NotFound from "@/pages/not-found";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogIn } from "lucide-react";
import { signInWithGoogle } from "@/lib/firebase";

// Admin Header Component
function AdminHeader() {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              PDFo Admin Panel
            </h1>
            <div className="hidden sm:flex space-x-4">
              <a
                href="/"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </a>
              <a
                href="/analytics"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Analytics
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <a
                href="https://pdfo.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                ← Back to Main Site
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Admin Login Component
function AdminLogin() {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Reload page after successful login
      window.location.reload();
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl">Admin Panel Access</CardTitle>
          <CardDescription>
            Sign in with your authorized Google account to access the PDFo admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleGoogleSignIn}
            className="w-full"
            size="lg"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            This page is not indexed by search engines
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Admin Router Component
function AdminRouter() {
  const [location] = useLocation();
  const { user, loading } = useAuth();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <AdminLogin />;
  }
  
  return (
    <>
      <AdminHeader />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Switch>
          <Route path="/purvish_tools" component={AdminDashboard} />
          <Route path="/purvish_tools/analytics" component={AnalyticsDashboard} />
          <Route path="/" component={AdminDashboard} />
          <Route path="/analytics" component={AnalyticsDashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

// Main Admin App Component
function AdminApp() {
  useEffect(() => {
    // Set admin-specific theme and prevent indexing
    document.title = "Admin Panel - PDFo";
    
    // Add meta tags to prevent search engine indexing
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow, nosnippet, noarchive';
    document.head.appendChild(metaRobots);
    
    const metaGooglebot = document.createElement('meta');
    metaGooglebot.name = 'googlebot';
    metaGooglebot.content = 'noindex, nofollow, nosnippet, noarchive';
    document.head.appendChild(metaGooglebot);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <AdminRouter />
            </div>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default AdminApp;
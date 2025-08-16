import { Link } from "wouter";
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolFooter } from "@/components/ToolFooter";

export default function Privacy() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back to Home */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl flex items-center justify-center text-white text-2xl mx-auto mb-6">
              <Shield className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Your privacy is our priority. Learn how we protect your data.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Last updated: January 2025</p>
          </div>

          {/* Privacy Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  <Lock className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Client-Side Processing</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">All PDF processing happens in your browser</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No File Storage</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">We never store your files on our servers</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  <Lock className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Data Collection</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">We don't collect personal information</p>
              </div>
            </div>
          </div>

          {/* Detailed Policy */}
          <div className="space-y-8">
            {/* Information We Collect */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Information We Collect</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">What We DON'T Collect:</h3>
                  <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-300">
                    <li>Personal files or documents you process</li>
                    <li>Names, email addresses, or contact information</li>
                    <li>Account information (no registration required)</li>
                    <li>File content or metadata</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">What We MAY Collect:</h3>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                    <li>Anonymous usage statistics (page views, tool usage)</li>
                    <li>Technical information (browser type, device type)</li>
                    <li>Error logs for debugging (no personal data included)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Process Your Files */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">How We Process Your Files</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload to Browser</h3>
                    <p>When you select files, they are loaded directly into your browser's memory using JavaScript.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Client-Side Processing</h3>
                    <p>All PDF operations (merge, split, rotate, etc.) happen entirely in your browser using PDF-lib.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Direct Download</h3>
                    <p>Processed files are downloaded directly from your browser to your device.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1 flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Automatic Cleanup</h3>
                    <p>Files are automatically removed from browser memory when you leave the page.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Third-Party Services */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Third-Party Services</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>PDFo may use the following third-party services:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Hosting Platform:</strong> Replit - for hosting our application</li>
                  <li><strong>Analytics:</strong> Basic web analytics for understanding usage patterns</li>
                  <li><strong>Donations:</strong> Buy Me a Coffee - for supporting the project</li>
                </ul>
                <p className="text-sm">These services have their own privacy policies and do not have access to your PDF files.</p>
              </div>
            </div>

            {/* Your Rights */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Rights</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>Since we don't collect personal data, most data protection rights don't apply. However:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>You have full control over your files at all times</li>
                  <li>You can use PDFo without providing any personal information</li>
                  <li>You can contact us about this privacy policy</li>
                  <li>You can request information about our data practices</li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
              <p className="mb-6 opacity-90">
                If you have questions about this privacy policy or our data practices, feel free to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 border-0">
                    Contact Us
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600">
                    About PDFo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolFooter />
    </>
  );
}
import { Link } from "wouter";
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainFooter } from "@/components/MainFooter";

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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Temporary Storage Only</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Files auto-deleted after 1 hour maximum</p>
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
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">What We DON'T Permanently Store:</h3>
                  <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-300">
                    <li>File content or metadata beyond 1 hour</li>
                    <li>Personal files or documents processed</li>
                    <li>User account data (except for logged-in users)</li>
                    <li>Detailed processing history</li>
                  </ul>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Temporary File Storage (Logged-in Users Only):</h3>
                  <ul className="list-disc list-inside space-y-1 text-orange-700 dark:text-orange-300">
                    <li>Uploaded files are temporarily stored for convenience</li>
                    <li>All files are automatically deleted after exactly 1 hour</li>
                    <li>Files are encrypted during temporary storage</li>
                    <li>You can manually delete files anytime from your dashboard</li>
                    <li>No file content is analyzed or accessed by our system</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">What We DO Collect (Minimal Data Only):</h3>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                    <li>Usage statistics for logged-in users (tool usage count, timestamps)</li>
                    <li>Basic browser information for performance optimization</li>
                    <li>Anonymous analytics for service improvement</li>
                    <li>Authentication data from Firebase (for logged-in users)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* File Storage and Deletion Policy */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">File Storage and Automatic Deletion Policy</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">⏰ Automatic File Deletion - 1 Hour Maximum Retention</h3>
                  <ul className="list-disc list-inside space-y-1 text-red-700 dark:text-red-300">
                    <li><strong>All uploaded files are automatically deleted after exactly 1 hour</strong></li>
                    <li>This policy applies to all users, regardless of account status</li>
                    <li>No exceptions are made for any file type or size</li>
                    <li>Deletion occurs automatically and cannot be prevented or extended</li>
                    <li>Users are responsible for downloading their processed files within this timeframe</li>
                  </ul>
                </div>
                <p>
                  This strict deletion policy ensures maximum privacy protection. We recommend downloading your processed files immediately after completion.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">File Storage Purpose:</h3>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                    <li>Enable multi-step processing workflows</li>
                    <li>Allow users to download processed files</li>
                    <li>Provide file management through user dashboard</li>
                    <li>Support batch operations on multiple files</li>
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

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Us</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  If you have any questions about this privacy policy, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p><strong>Email:</strong> privacy@pdfo.com</p>
                  <p><strong>Company:</strong> Pravaah AI Tech</p>
                  <p><strong>Location:</strong> Khambhat, Gujarat, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MainFooter />
    </>
  );
}
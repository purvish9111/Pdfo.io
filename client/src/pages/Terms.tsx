import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, FileText, Scale, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainFooter } from "@/components/MainFooter";

export default function Terms() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center text-white text-2xl mx-auto mb-6">
              <Scale className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Please read these terms carefully before using PDFo.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Last updated: January 2025</p>
          </div>

          {/* Agreement Notice */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 mb-8">
            <div className="flex items-start">
              <FileText className="h-8 w-8 text-blue-500 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Agreement to Terms</h3>
                <p className="text-blue-800 dark:text-blue-200">
                  By using PDFo, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Service Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Service Description</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  PDFo is a free online platform that provides PDF manipulation and conversion tools. Our service allows you to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Merge, split, and reorder PDF documents</li>
                  <li>Convert PDFs to various formats (images, Word, Excel, etc.)</li>
                  <li>Convert other formats to PDF</li>
                  <li>Add security features like passwords and watermarks</li>
                  <li>Edit PDF metadata and add page numbers</li>
                  <li>Compress PDF files</li>
                </ul>
                <p>
                  All processing is performed client-side in your browser for maximum privacy and security. For logged-in users, 
                  files may be temporarily stored on our servers for up to 1 hour to enable additional features, after which they 
                  are automatically and permanently deleted.
                </p>
              </div>
            </div>

            {/* Acceptable Use */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Acceptable Use</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>You may use PDFo for any legal purpose. You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Process documents that contain illegal content</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Attempt to reverse engineer or hack our service</li>
                  <li>Use automated scripts to overload our servers</li>
                  <li>Process copyrighted material without permission</li>
                  <li>Upload malicious files or malware</li>
                </ul>
              </div>
            </div>

            {/* Service Availability */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Service Availability</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  PDFo is provided "as is" and we make no guarantees about service availability. We may:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Temporarily suspend service for maintenance</li>
                  <li>Modify or discontinue features</li>
                  <li>Update these terms with reasonable notice</li>
                </ul>
                <p>
                  We strive to provide reliable service but cannot guarantee 100% uptime.
                </p>
              </div>
            </div>

            {/* Disclaimer of Warranties */}
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-8">
              <div className="flex items-start">
                <AlertTriangle className="h-8 w-8 text-yellow-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mb-6">Disclaimer of Warranties</h2>
                  <div className="space-y-4 text-yellow-800 dark:text-yellow-200">
                    <p>
                      PDFo is provided "AS IS" without warranties of any kind, either express or implied, including but not limited to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Merchantability or fitness for a particular purpose</li>
                      <li>Accuracy or completeness of results</li>
                      <li>Compatibility with all file formats</li>
                      <li>Uninterrupted or error-free operation</li>
                    </ul>
                    <p className="font-semibold">
                      Always keep backups of your original files before processing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Limitation of Liability</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  To the maximum extent permitted by law, Pravaah AI Tech and PDFo shall not be liable for any:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Direct, indirect, incidental, or consequential damages</li>
                  <li>Loss of data, profits, or business opportunities</li>
                  <li>Service interruptions or technical issues</li>
                  <li>Damages arising from use or inability to use the service</li>
                </ul>
                <p>
                  Our total liability, if any, shall not exceed the amount you paid for using PDFo (which is $0, as it's free).
                </p>
              </div>
            </div>

            {/* File Retention Policy */}
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-6">File Retention and Deletion Policy</h2>
              <div className="space-y-4 text-red-800 dark:text-red-200">
                <div className="bg-red-100 dark:bg-red-900 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">⏰ 1-Hour Maximum File Retention</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>All uploaded files are automatically and permanently deleted after exactly 1 hour</li>
                    <li>This policy applies universally - no exceptions for any user or file type</li>
                    <li>Users must download their processed files within this timeframe</li>
                    <li>Files cannot be recovered after automatic deletion</li>
                  </ul>
                </div>
                <p>
                  By using PDFo, you acknowledge and agree to this strict file retention policy. We recommend downloading your processed files immediately upon completion.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  If you have questions about these terms, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p><strong>Email:</strong> legal@pdfo.com</p>
                  <p><strong>Company:</strong> Pravaah AI Tech</p>
                  <p><strong>Founder:</strong> Purvish Patel</p>
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
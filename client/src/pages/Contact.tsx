import { Link } from "wouter";
import { ArrowLeft, Mail, MessageCircle, Coffee, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolFooter } from "@/components/ToolFooter";

export default function Contact() {
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
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl flex items-center justify-center text-white text-2xl mx-auto mb-6">
              <MessageCircle className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Have questions, feedback, or suggestions? We'd love to hear from you!
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Email Contact */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Email Us</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  For support, feedback, or business inquiries
                </p>
                <a 
                  href="mailto:contact@pravaahaitech.com"
                  className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  contact@pravaahaitech.com
                </a>
              </div>
            </div>

            {/* Support Us */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                  <Coffee className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Support PDFo</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Help us keep PDFo free and improve it further
                </p>
                <a 
                  href="https://buymeacoffee.com/pravaah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                >
                  <Coffee className="h-4 w-4 mr-2" />
                  Buy Me a Coffee
                </a>
              </div>
            </div>
          </div>

          {/* Founder Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Meet the Creator</h2>
            <div className="text-center">
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Purvish Patel</h3>
                <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <Building2 className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Founder, Pravaah AI Tech</span>
                </div>
                <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <MapPin className="h-5 w-5 mr-2 text-green-500" />
                  <span>Khambhat, Gujarat, India</span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  "PDFo was born from my belief that powerful tools should be accessible to everyone, regardless of their budget. 
                  As an individual developer, I'm committed to keeping PDFo completely free while ensuring your privacy and data security."
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Common Questions</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Is PDFo really free?</h3>
                <p className="text-gray-600 dark:text-gray-300">Yes! PDFo is completely free to use with no hidden costs, subscriptions, or premium features.</p>
              </div>
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How do you keep my files secure?</h3>
                <p className="text-gray-600 dark:text-gray-300">All processing happens in your browser. We never see, store, or have access to your files.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I request new features?</h3>
                <p className="text-gray-600 dark:text-gray-300">Absolutely! Send us your suggestions and we'll consider them for future updates.</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Do you offer business solutions?</h3>
                <p className="text-gray-600 dark:text-gray-300">Currently, PDFo is designed for individual use. Contact us to discuss custom business needs.</p>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 mb-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Response Time</h3>
              <p className="text-blue-800 dark:text-blue-200">
                We typically respond to emails within 24-48 hours. For urgent issues, please mention "URGENT" in your subject line.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get in Touch?</h2>
            <p className="mb-6 opacity-90 max-w-2xl mx-auto">
              Whether you have a question, feedback, or just want to say hello, we're here to help. 
              Your input helps make PDFo better for everyone!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:contact@pravaahaitech.com">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 border-0">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </a>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ToolFooter />
    </>
  );
}
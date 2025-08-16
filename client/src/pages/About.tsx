import { Link } from "wouter";
import { ArrowLeft, MapPin, Building, User, Heart, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolFooter } from "@/components/ToolFooter";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import purvishPhoto from "@assets/image_1755367460356.jpg";

export default function About() {
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
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-3xl flex items-center justify-center text-white text-2xl mx-auto mb-6">
              <User className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About PDFo</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Empowering everyone with powerful PDF tools, completely free and secure
            </p>
          </div>

          {/* About PDFo */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What is PDFo?</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                PDFo is a comprehensive web-based PDF manipulation and conversion platform that provides users with 22 professional PDF tools. Our mission is to make PDF processing accessible, secure, and completely free for everyone.
              </p>
              <p>
                Whether you need to merge, split, convert, compress, or secure your PDF documents, PDFo has you covered. All processing happens directly in your browser, ensuring your documents never leave your device and remain completely private.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white mb-3 mx-auto">
                    <span className="text-xl font-bold">22</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">PDF Tools</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Complete toolkit</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white mb-3 mx-auto">
                    <span className="text-xl font-bold">100%</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Free</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Always free to use</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white mb-3 mx-auto">
                    <i className="fas fa-lock text-lg"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Secure</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Client-side processing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Founder Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Meet the Founder</h2>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Photo */}
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={purvishPhoto} 
                    alt="Purvish Patel - Founder of Pravaah AI Tech" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Information */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Purvish Patel</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center md:justify-start text-gray-600 dark:text-gray-300">
                    <Building className="h-5 w-5 mr-3 text-blue-500" />
                    <span className="font-medium">Founder of Pravaah AI Tech</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start text-gray-600 dark:text-gray-300">
                    <MapPin className="h-5 w-5 mr-3 text-green-500" />
                    <span>Khambhat, Gujarat, India</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start text-gray-600 dark:text-gray-300">
                    <User className="h-5 w-5 mr-3 text-purple-500" />
                    <span>Individual Creator & Entrepreneur</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    "I created PDFo with a simple vision: to provide everyone with powerful PDF tools that are completely free and secure. As an individual developer, I believe in building solutions that truly serve people without compromising their privacy or charging hidden fees."
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Why PDFo?</h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <Heart className="h-5 w-5 mr-3 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Built with passion for user privacy and security</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 flex-shrink-0"></span>
                      <span>No subscriptions, no hidden costs, always free</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-4 mt-2 flex-shrink-0"></span>
                      <span>Client-side processing keeps your documents private</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-4 mt-2 flex-shrink-0"></span>
                      <span>Comprehensive toolkit for all PDF needs</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8 text-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Support PDFo's Development
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                PDFo is completely free and always will be. If you find it useful, consider supporting its development with a coffee!
              </p>
              <BuyMeCoffeeButton />
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
              <p className="mb-6 opacity-90">
                Have feedback, suggestions, or just want to say hello?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 border-0 w-full sm:w-auto">
                    <i className="fas fa-envelope mr-2"></i>
                    Get in Touch
                  </Button>
                </Link>
                <a href="https://buymeacoffee.com/pravaah" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto">
                    <i className="fas fa-coffee mr-2"></i>
                    Buy Me a Coffee
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolFooter />
    </>
  );
}
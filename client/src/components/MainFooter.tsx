import { Link } from "wouter";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoUrl from "@assets/logo_1755359015395.png";

export function MainFooter() {
  const tools = [
    { name: "Merge PDF", path: "/merge" },
    { name: "Split PDF", path: "/split" },
    { name: "Reorder Pages", path: "/reorder" },
    { name: "Delete Pages", path: "/delete" },
    { name: "Rotate PDF", path: "/rotate" },
    { name: "Page Numbers", path: "/page-numbers" },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src={logoUrl} 
                alt="PDFo Logo" 
                className="h-10 w-auto filter brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Professional PDF tools for everyone. Fast, secure, and completely free. Transform your documents with ease.
            </p>
            <Button asChild className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
              <a 
                href="https://buymeacoffee.com/pravaah" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <Coffee className="mr-2 h-4 w-4" />
                Support PDFo
              </a>
            </Button>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold mb-4">PDF Tools</h3>
            <ul className="space-y-2 text-gray-400">
              {tools.map((tool) => (
                <li key={tool.path}>
                  <Link 
                    href={tool.path} 
                    className="hover:text-white transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 PDFo. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-github"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

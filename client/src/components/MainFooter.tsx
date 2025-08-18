import { Link } from "wouter";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
// Logo removed from footer to match original design

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
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">PDFo</h2>
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
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><a href="https://buymeacoffee.com/pravaah" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Support Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 PDFo | Made with ❤️ by Pravaah AI Tech</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="https://www.facebook.com/pdfo.io/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-xl" aria-label="Follow us on Facebook">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://x.com/PDFo_io" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-xl" aria-label="Follow us on X (Twitter)">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/showcase/pdfo/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-xl" aria-label="Connect on LinkedIn">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

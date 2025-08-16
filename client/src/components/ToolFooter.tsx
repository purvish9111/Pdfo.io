import { Link } from "wouter";

export function ToolFooter() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
            PDFo is a free online PDF tool by Pravaah AI Tech. We respect your privacy—files are processed securely and automatically deleted after processing.
          </p>
          
          {/* Navigation Links */}
          <div className="flex justify-center gap-8 mt-8 mb-6">
            <Link href="/about">
              <a className="text-gray-400 hover:text-white transition-colors text-sm">About</a>
            </Link>
            <Link href="/company">
              <a className="text-gray-400 hover:text-white transition-colors text-sm">Company Links</a>
            </Link>
            <a 
              href="https://buymeacoffee.com/pravaah" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Support Us
            </a>
          </div>
          
          <div className="mt-8">
            <p className="text-gray-400 text-sm">
              © 2025 PDFo | Made with ❤️ by Pravaah AI Tech
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

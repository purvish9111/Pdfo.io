// Simple App without React hooks to fix loading issues
export default function SimpleApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="PDFo - Free Online PDF Tools" 
                className="h-8 w-8 object-contain" 
                style={{ height: '32px', width: '32px', objectFit: 'contain' }}
              />
              <span className="ml-2 text-xl font-bold text-gray-900">PDFo</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-semibold">Home</a>
              <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <a href="/purvish_tools" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Admin</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Free Online PDF Tools</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform, edit, and optimize your PDF documents with our comprehensive suite of 26 professional PDF tools. 
              Fast, secure, and completely free to use.
            </p>
          </div>

          {/* PDF Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Core PDF Tools */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl">📄</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Merge PDF</h3>
              <p className="text-gray-600 text-sm">Combine multiple PDF files into one document</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">✂️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Split PDF</h3>
              <p className="text-gray-600 text-sm">Extract specific pages from PDF documents</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-purple-600 text-xl">🗜️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Compress PDF</h3>
              <p className="text-gray-600 text-sm">Reduce PDF file size while maintaining quality</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-orange-600 text-xl">🔄</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Rotate PDF</h3>
              <p className="text-gray-600 text-sm">Rotate PDF pages to correct orientation</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-red-600 text-xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lock PDF</h3>
              <p className="text-gray-600 text-sm">Protect PDF files with password encryption</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-yellow-600 text-xl">🔓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlock PDF</h3>
              <p className="text-gray-600 text-sm">Remove password protection from PDF files</p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Process your PDF files in seconds with our optimized tools</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Secure</h3>
              <p className="text-gray-600">Your files are processed locally and deleted automatically</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">🆓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Always Free</h3>
              <p className="text-gray-600">No registration required, unlimited usage for all tools</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 PDFo.io - Free Online PDF Tools. All rights reserved.</p>
          <p className="text-gray-400 mt-2">Contact: info@pdfo.io</p>
        </div>
      </footer>
    </div>
  );
}
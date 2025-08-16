import { Link } from "wouter";
import { Coffee, ArrowRight, Shield, Zap, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainFooter } from "@/components/MainFooter";

export default function Home() {
  const tools = [
    {
      name: "Merge PDF",
      path: "/merge",
      description: "Combine multiple PDF files into one document",
      iconBg: "bg-blue-500",
      iconText: "⊞"
    },
    {
      name: "Split PDF",
      path: "/split", 
      description: "Extract pages or split PDF into multiple files",
      iconBg: "bg-green-500",
      iconText: "✂"
    },
    {
      name: "Reorder Pages",
      path: "/reorder",
      description: "Rearrange pages in your PDF document",
      iconBg: "bg-purple-500", 
      iconText: "↕"
    },
    {
      name: "Delete Pages",
      path: "/delete",
      description: "Remove unwanted pages from PDF",
      iconBg: "bg-red-500",
      iconText: "🗑"
    },
    {
      name: "Rotate PDF",
      path: "/rotate",
      description: "Rotate PDF pages by 90, 180, or 270 degrees",
      iconBg: "bg-orange-500",
      iconText: "↻"
    },
    {
      name: "Page Numbers",
      path: "/page-numbers",
      description: "Add page numbers to your PDF document",
      iconBg: "bg-indigo-500",
      iconText: "#"
    },
  ];

  const scrollToTools = () => {
    document.getElementById('tools-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-bg py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Professional PDF Tools
          </h1>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-500 mb-8">
            Made Simple
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Merge, split, convert, and edit your PDF files with our comprehensive suite of professional tools. Fast, secure, and completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={scrollToTools} 
              size="lg"
              className="bg-blue-500 text-white hover:bg-blue-600 px-8 py-3 text-lg rounded-lg font-medium"
            >
              Explore Tools
            </Button>
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-8 py-3 text-lg rounded-lg font-medium"
            >
              <a 
                href="https://buymeacoffee.com/pravaah" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Coffee className="mr-2 h-5 w-5" />
                Support Us
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* PDF Tools Grid */}
      <section id="tools-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Choose Your PDF Tool</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Select from our comprehensive suite of PDF manipulation tools designed for professionals and individuals alike.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
            {tools.map((tool) => (
              <Link key={tool.path} href={tool.path}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 cursor-pointer group">
                  <div className="flex items-center">
                    <div className={`w-14 h-14 ${tool.iconBg} rounded-xl flex items-center justify-center text-white text-2xl font-bold mr-5`}>
                      {tool.iconText}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{tool.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Demo Link */}
          <div className="text-center mt-12">
            <Link href="/pdf-preview-demo">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span className="text-lg font-medium">Try PDF Preview Demo</span>
                <span className="ml-2 text-xl">🔍</span>
              </div>
            </Link>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              See how our client-side PDF processing works
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose PDFo?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pdfo-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure & Private</h3>
              <p className="text-gray-600 dark:text-gray-300">Your files are processed securely and deleted automatically after processing.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pdfo-emerald rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">Process your PDF files in seconds with our optimized algorithms.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pdfo-violet rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Works Everywhere</h3>
              <p className="text-gray-600 dark:text-gray-300">Access our tools from any device, anywhere, anytime.</p>
            </div>
          </div>
        </div>
      </section>

      <MainFooter />
    </>
  );
}

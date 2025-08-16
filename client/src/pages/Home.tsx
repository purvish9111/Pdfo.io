import { Link } from "wouter";
import { Coffee, ArrowRight, Shield, Zap, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainFooter } from "@/components/MainFooter";

export default function Home() {
  const tools = [
    {
      name: "Merge PDF",
      path: "/merge",
      description: "Combine multiple PDF files into a single document with custom ordering.",
      icon: "fas fa-layer-group",
      gradient: "from-blue-500 to-blue-600",
      color: "text-pdfo-blue"
    },
    {
      name: "Split PDF",
      path: "/split",
      description: "Extract specific pages or split your PDF into multiple separate files.",
      icon: "fas fa-cut",
      gradient: "from-emerald-500 to-emerald-600",
      color: "text-pdfo-emerald"
    },
    {
      name: "Reorder Pages",
      path: "/reorder",
      description: "Drag and drop to rearrange pages in your PDF document.",
      icon: "fas fa-arrows-alt",
      gradient: "from-violet-500 to-violet-600",
      color: "text-pdfo-violet"
    },
    {
      name: "Delete Pages",
      path: "/delete",
      description: "Remove unwanted pages from your PDF with a simple click.",
      icon: "fas fa-trash-alt",
      gradient: "from-red-500 to-red-600",
      color: "text-red-500"
    },
    {
      name: "Rotate PDF",
      path: "/rotate",
      description: "Rotate pages 90, 180, or 270 degrees to correct orientation.",
      icon: "fas fa-redo",
      gradient: "from-orange-500 to-orange-600",
      color: "text-orange-500"
    },
    {
      name: "Page Numbers",
      path: "/page-numbers",
      description: "Add customizable page numbers to your PDF documents.",
      icon: "fas fa-hashtag",
      gradient: "from-teal-500 to-teal-600",
      color: "text-teal-500"
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
      <section className="bg-gray-50 dark:bg-gray-800 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Professional PDF Tools
          </h1>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-500 mb-8">
            Made Simple
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Merge, split, convert, and edit your PDF files with our comprehensive suite of professional tools. Fast, secure, and completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={scrollToTools} 
              size="lg"
              className="bg-blue-500 text-white hover:bg-blue-600 px-8 py-4 text-lg rounded-lg"
            >
              Explore Tools
            </Button>
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-8 py-4 text-lg rounded-lg"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link key={tool.path} href={tool.path}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 cursor-pointer group">
                  <div className={`w-12 h-12 bg-gradient-to-br ${tool.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <i className={`${tool.icon} text-white text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{tool.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{tool.description}</p>
                  <div className={`flex items-center ${tool.color} font-medium`}>
                    Start {tool.name.toLowerCase()} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
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

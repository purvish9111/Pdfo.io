import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Coffee, ArrowRight, Shield, Zap, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainFooter } from "@/components/MainFooter";
import { SEOHead } from "@/components/SEOHead";
import { ToolsFilter } from "@/components/ToolsFilter";
import { ToolsToggle } from "@/components/ToolsToggle";
import { OtherToolsGrid } from "@/components/OtherToolsGrid";

interface Tool {
  name: string;
  path: string;
  description: string;
  iconBg: string;
  faIcon: string;
  category: string;
}

export default function Home() {
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [activeTab, setActiveTab] = useState<'pdf' | 'other'>('pdf');
  
  const homeSEO = {
    title: "PDFo - Free Online PDF Tools | Merge, Split, Convert & Edit PDFs",
    description: "Free online PDF tools to merge, split, compress, convert, and edit PDF files. 26+ professional PDF tools with drag-and-drop interface. No registration required.",
    keywords: "pdf tools, merge pdf, split pdf, pdf converter, compress pdf, pdf to word, word to pdf, free pdf tools online",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PDFo",
      "description": "Free online PDF tools for merging, splitting, converting, and editing PDF documents",
      "url": window.location.origin,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Merge PDF files",
        "Split PDF documents", 
        "Convert PDF to Word/Excel/PowerPoint",
        "Convert images to PDF",
        "Compress PDF files",
        "Add watermarks and page numbers",
        "Edit PDF metadata",
        "Password protect PDFs"
      ]
    }
  };
  const tools = [
    {
      name: "Merge PDF",
      path: "/merge",
      description: "Combine multiple PDF files into one document",
      iconBg: "bg-blue-500",
      faIcon: "fas fa-layer-group",
      category: "manipulation"
    },
    {
      name: "Split PDF",
      path: "/split", 
      description: "Extract pages or split PDF into multiple files",
      iconBg: "bg-green-500",
      faIcon: "fas fa-cut",
      category: "manipulation"
    },
    {
      name: "Reorder Pages",
      path: "/reorder",
      description: "Rearrange pages in your PDF document",
      iconBg: "bg-purple-500", 
      faIcon: "fas fa-sort",
      category: "manipulation"
    },
    {
      name: "Delete Pages",
      path: "/delete",
      description: "Remove unwanted pages from PDF",
      iconBg: "bg-red-500",
      faIcon: "fas fa-trash-alt",
      category: "manipulation"
    },
    {
      name: "Rotate PDF",
      path: "/rotate",
      description: "Rotate PDF pages by 90, 180, or 270 degrees",
      iconBg: "bg-orange-500",
      faIcon: "fas fa-redo-alt",
      category: "manipulation"
    },
    {
      name: "Page Numbers",
      path: "/page-numbers",
      description: "Add page numbers to your PDF document",
      iconBg: "bg-indigo-500",
      faIcon: "fas fa-list-ol",
      category: "manipulation"
    },
    {
      name: "Edit Metadata",
      path: "/edit-metadata",
      description: "Edit PDF title, author, subject and keywords",
      iconBg: "bg-cyan-500",
      faIcon: "fas fa-edit",
      category: "optimization"
    },
    {
      name: "Watermark PDF",
      path: "/watermark-pdf",
      description: "Add text or image watermarks to your PDF",
      iconBg: "bg-teal-500",
      faIcon: "fas fa-tint",
      category: "security"
    },
    {
      name: "Lock PDF",
      path: "/lock-pdf",
      description: "Password protect your PDF document",
      iconBg: "bg-yellow-500",
      faIcon: "fas fa-lock",
      category: "security"
    },
    {
      name: "Unlock PDF",
      path: "/unlock-pdf", 
      description: "Remove password protection from PDF",
      iconBg: "bg-pink-500",
      faIcon: "fas fa-unlock-alt",
      category: "security"
    },
    {
      name: "Compress PDF",
      path: "/compress-pdf",
      description: "Reduce PDF file size efficiently",
      iconBg: "bg-gray-500",
      faIcon: "fas fa-compress-alt",
      category: "optimization"
    },
    {
      name: "Extract Images",
      path: "/extract-images",
      description: "Extract all images from PDF as PNG files",
      iconBg: "bg-purple-500",
      faIcon: "fas fa-images",
      category: "manipulation"
    },
    {
      name: "PDF Optimizer",
      path: "/optimize-pdf",
      description: "Optimize PDF to reduce size without quality loss",
      iconBg: "bg-orange-500",
      faIcon: "fas fa-magic",
      category: "optimization"
    },
    {
      name: "Remove Blank Pages",
      path: "/remove-blank-pages",
      description: "Automatically remove empty pages from PDF",
      iconBg: "bg-red-500",
      faIcon: "fas fa-eraser",
      category: "manipulation"
    },
    {
      name: "Add Header & Footer",
      path: "/add-header-footer",
      description: "Add custom headers and footers to all pages",
      iconBg: "bg-indigo-500",
      faIcon: "fas fa-align-center",
      category: "manipulation"
    },
    {
      name: "PDF to JPG",
      path: "/pdf-to-jpg",
      description: "Convert PDF pages to high-quality JPG images",
      iconBg: "bg-rose-500",
      faIcon: "fas fa-image",
      category: "conversion_from_pdf"
    },
    {
      name: "PDF to PNG",
      path: "/pdf-to-png", 
      description: "Convert PDF pages to PNG images with transparency",
      iconBg: "bg-emerald-500",
      faIcon: "far fa-images",
      category: "conversion_from_pdf"
    },
    {
      name: "PDF to TIFF",
      path: "/pdf-to-tiff",
      description: "Convert PDF to TIFF format with compression options",
      iconBg: "bg-amber-500",
      faIcon: "fas fa-file-image",
      category: "conversion_from_pdf"
    },
    {
      name: "PDF to Word",
      path: "/pdf-to-word",
      description: "Convert PDF to editable Word document",
      iconBg: "bg-blue-600",
      faIcon: "fas fa-file-word",
      category: "conversion_from_pdf"
    },
    {
      name: "PDF to Excel",
      path: "/pdf-to-excel",
      description: "Extract tables and data to Excel spreadsheet",
      iconBg: "bg-green-600",
      faIcon: "fas fa-file-excel",
      category: "conversion_from_pdf"
    },
    {
      name: "PDF to PPT",
      path: "/pdf-to-ppt",
      description: "Convert PDF pages to PowerPoint slides",
      iconBg: "bg-orange-600",
      faIcon: "fas fa-file-powerpoint",
      category: "conversion_from_pdf"
    },
    {
      name: "PDF to TXT",
      path: "/pdf-to-txt",
      description: "Extract plain text content from PDF",
      iconBg: "bg-slate-500",
      faIcon: "fas fa-file-alt",
      category: "conversion_from_pdf"
    },
    {
      name: "PDF to JSON",
      path: "/pdf-to-json",
      description: "Extract structured data as JSON",
      iconBg: "bg-violet-500",
      faIcon: "fas fa-code",
      category: "conversion_from_pdf"
    },
    {
      name: "PNG to PDF",
      path: "/png-to-pdf",
      description: "Convert PNG images to PDF document",
      iconBg: "bg-lime-500",
      faIcon: "fas fa-file-image",
      category: "conversion_to_pdf"
    },
    {
      name: "Word to PDF",
      path: "/word-to-pdf",
      description: "Convert Word documents to PDF format",
      iconBg: "bg-sky-600",
      faIcon: "fas fa-file-word",
      category: "conversion_to_pdf"
    },
    {
      name: "Excel to PDF",
      path: "/excel-to-pdf",
      description: "Convert Excel spreadsheets to PDF format",
      iconBg: "bg-emerald-600",
      faIcon: "fas fa-file-excel",
      category: "conversion_to_pdf"
    },
  ];

  const otherTools = [
    {
      name: "Image Compressor",
      path: "/image-compressor",
      description: "Compress JPG/PNG images without quality loss",
      iconBg: "bg-green-500",
      faIcon: "fas fa-compress-alt",
      category: "image"
    },
    {
      name: "URL Shortener",
      path: "/url-shortener", 
      description: "Create short links with click analytics",
      iconBg: "bg-blue-500",
      faIcon: "fas fa-link",
      category: "utility"
    },
    {
      name: "QR Code Generator",
      path: "/qr-generator",
      description: "Generate QR codes for text, URLs, and data",
      iconBg: "bg-purple-500",
      faIcon: "fas fa-qrcode", 
      category: "utility"
    },
    {
      name: "Password Generator",
      path: "/password-generator",
      description: "Create strong, secure passwords",
      iconBg: "bg-red-500",
      faIcon: "fas fa-key",
      category: "security"
    },
    {
      name: "Color Palette",
      path: "/color-palette",
      description: "Extract colors from images and create palettes",
      iconBg: "bg-pink-500",
      faIcon: "fas fa-palette",
      category: "design"
    },
    {
      name: "Unit Converter",
      path: "/unit-converter",
      description: "Convert length, weight, temperature units",
      iconBg: "bg-orange-500",
      faIcon: "fas fa-calculator",
      category: "utility"
    },
    {
      name: "Hash Generator",
      path: "/hash-generator",
      description: "Generate MD5, SHA256, SHA512 hashes",
      iconBg: "bg-gray-500",
      faIcon: "fas fa-hashtag",
      category: "security"
    },
    {
      name: "Base64 Encoder",
      path: "/base64-encoder",
      description: "Encode/decode text and files to Base64",
      iconBg: "bg-indigo-500",
      faIcon: "fas fa-code",
      category: "utility"
    }
  ];

  // Initialize filteredTools with all tools when component mounts
  useEffect(() => {
    setFilteredTools(tools);
  }, []);

  const scrollToTools = () => {
    document.getElementById('tools-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <>
      <SEOHead
        title={homeSEO.title}
        description={homeSEO.description}
        keywords={homeSEO.keywords}
        canonicalUrl={window.location.origin}
        structuredData={homeSEO.structuredData}
      />
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

      {/* Tools Section */}
      <section id="tools-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {activeTab === 'pdf' ? 'Choose Your PDF Tool' : 'Choose Your Tool'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {activeTab === 'pdf' 
                ? 'Select from our comprehensive suite of PDF manipulation tools designed for professionals and individuals alike.'
                : 'Explore our collection of useful utility tools for everyday tasks.'
              }
            </p>
          </div>

          {/* Tools Toggle */}
          <ToolsToggle 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Content with CSS Transitions */}
          <div className={`transition-all duration-300 ease-in-out ${activeTab === 'pdf' ? 'opacity-100' : 'opacity-100'}`}>
            {activeTab === 'pdf' ? (
              <div>
                {/* PDF Tools Filter */}
                <ToolsFilter 
                  tools={tools}
                  onFilteredToolsChange={setFilteredTools}
                />

                <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
                  {filteredTools.map((tool) => (
                    <Link key={tool.path} href={tool.path}>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 cursor-pointer group">
                        <div className="flex items-center">
                          <div className={`w-14 h-14 ${tool.iconBg} rounded-xl flex items-center justify-center text-white text-xl mr-5`} role="img" aria-label={`${tool.name} tool`}>
                            <i className={tool.faIcon} aria-hidden="true"></i>
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
              </div>
            ) : (
              <OtherToolsGrid tools={otherTools} />
            )}
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

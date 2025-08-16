import { Link } from "wouter";
import { ArrowLeft, ExternalLink, Coffee, Mail, Globe, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolFooter } from "@/components/ToolFooter";

interface LinkItem {
  title: string;
  description: string;
  url: string;
  icon: any;
  color: string;
  note?: string;
}

interface LinkSection {
  category: string;
  items: LinkItem[];
}

export default function Company() {
  const links: LinkSection[] = [
    {
      category: "Support & Donations",
      items: [
        {
          title: "Buy Me a Coffee",
          description: "Support PDFo's development with a coffee",
          url: "https://buymeacoffee.com/pravaah",
          icon: Coffee,
          color: "bg-yellow-500"
        }
      ]
    },
    {
      category: "Company Information",
      items: [
        {
          title: "Pravaah AI Tech",
          description: "Visit our company website",
          url: "#",
          icon: Building2,
          color: "bg-blue-500",
          note: "Website coming soon"
        },
        {
          title: "Contact Email",
          description: "Get in touch with us directly",
          url: "mailto:contact@pravaahaitech.com",
          icon: Mail,
          color: "bg-green-500",
          note: "For business inquiries and support"
        }
      ]
    },
    {
      category: "Product Links",
      items: [
        {
          title: "PDFo - PDF Tools",
          description: "Comprehensive PDF manipulation platform",
          url: "/",
          icon: Globe,
          color: "bg-purple-500",
          note: "You are here!"
        }
      ]
    }
  ];

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
              <Building2 className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Company Links</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Connect with Pravaah AI Tech and explore our digital presence
            </p>
          </div>

          {/* Company Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pravaah AI Tech</h2>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p><strong>Founder:</strong> Purvish Patel</p>
                <p><strong>Location:</strong> Khambhat, Gujarat, India</p>
                <p><strong>Focus:</strong> AI-powered tools and solutions</p>
                <p><strong>Mission:</strong> Building free, secure, and user-friendly tools for everyone</p>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="space-y-8">
            {links.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{section.category}</h2>
                <div className="grid gap-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="group">
                      <a
                        href={item.url}
                        target={item.url.startsWith('http') ? '_blank' : undefined}
                        rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className={`flex items-center p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 ${
                          item.note === "You are here!" 
                            ? 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-500' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white mr-4 flex-shrink-0`}>
                          <item.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {item.title}
                            </h3>
                            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
                          {item.note && (
                            <p className={`text-sm mt-2 ${
                              item.note === "You are here!" 
                                ? 'text-blue-600 dark:text-blue-400 font-medium' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {item.note}
                            </p>
                          )}
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Support Section */}
          <div className="mt-8">
            <div className="bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Support Our Work</h3>
              <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                PDFo and our other tools are completely free. Your support helps us continue developing amazing tools for everyone.
              </p>
              <a href="https://buymeacoffee.com/pravaah" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 border-0">
                  <Coffee className="h-5 w-5 mr-2" />
                  Buy Me a Coffee
                </Button>
              </a>
            </div>
          </div>

          {/* Back to Tools */}
          <div className="text-center mt-8">
            <Link href="/">
              <Button size="lg" variant="outline" className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Back to PDF Tools
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <ToolFooter />
    </>
  );
}
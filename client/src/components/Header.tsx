import { Link, useLocation } from "wouter";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();

  const tools = [
    { name: "Merge PDF", path: "/merge", icon: "fas fa-layer-group" },
    { name: "Split PDF", path: "/split", icon: "fas fa-cut" },
    { name: "Reorder Pages", path: "/reorder", icon: "fas fa-arrows-alt" },
    { name: "Delete Pages", path: "/delete", icon: "fas fa-trash-alt" },
    { name: "Rotate PDF", path: "/rotate", icon: "fas fa-redo" },
    { name: "Page Numbers", path: "/page-numbers", icon: "fas fa-hashtag" },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-pdfo-blue to-pdfo-violet rounded-lg flex items-center justify-center text-white font-bold text-lg">
                PDF
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">PDFo</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/" 
                className={`transition-colors ${
                  location === "/" 
                    ? "text-pdfo-blue" 
                    : "text-gray-600 dark:text-gray-300 hover:text-pdfo-blue dark:hover:text-pdfo-blue"
                }`}
              >
                Home
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-gray-600 dark:text-gray-300 hover:text-pdfo-blue dark:hover:text-pdfo-blue p-0 h-auto font-normal"
                  >
                    Tools <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {tools.map((tool) => (
                    <DropdownMenuItem key={tool.path} asChild>
                      <Link 
                        href={tool.path}
                        className="w-full cursor-pointer"
                      >
                        {tool.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          {/* Dark mode toggle and mobile menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4 text-gray-600" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Menu className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

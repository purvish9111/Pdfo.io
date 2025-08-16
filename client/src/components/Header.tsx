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
import logoUrl from "@assets/logo_1755359015395.png";

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
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center cursor-pointer">
              <img 
                src={logoUrl} 
                alt="PDFo Logo" 
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Dark mode toggle and mobile menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Sun className="h-5 w-5 text-gray-600" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

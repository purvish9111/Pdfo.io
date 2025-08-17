import { Link, useLocation } from "wouter";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Menu, ChevronDown, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { signOutUser } from "@/lib/firebase";
import logoUrl from "@assets/logo_1755359015395.png";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const { user } = useAuth();

  const tools = [
    { name: "Merge PDF", path: "/merge", icon: "fas fa-layer-group" },
    { name: "Split PDF", path: "/split", icon: "fas fa-cut" },
    { name: "Reorder Pages", path: "/reorder", icon: "fas fa-arrows-alt" },
    { name: "Delete Pages", path: "/delete", icon: "fas fa-trash-alt" },
    { name: "Rotate PDF", path: "/rotate", icon: "fas fa-redo" },
    { name: "Page Numbers", path: "/page-numbers", icon: "fas fa-hashtag" },
  ];

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                location === "/" ? "text-blue-600 dark:text-blue-400 font-semibold" : ""
              }`}
            >
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Tools
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {tools.map((tool) => (
                  <DropdownMenuItem key={tool.path} asChild>
                    <Link href={tool.path} className="flex items-center">
                      <i className={`${tool.icon} w-4 h-4 mr-3`}></i>
                      {tool.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link 
              href="/about" 
              className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                location === "/about" ? "text-blue-600 dark:text-blue-400 font-semibold" : ""
              }`}
            >
              About
            </Link>
            
            <Link 
              href="/contact" 
              className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                location === "/contact" ? "text-blue-600 dark:text-blue-400 font-semibold" : ""
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </Button>

            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">{user.displayName || user.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <User className="mr-2 h-4 w-4" />
                    {user.displayName || user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="py-6">
                  <nav className="space-y-4">
                    <Link 
                      href="/" 
                      className={`block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                        location === "/" ? "text-blue-600 dark:text-blue-400 font-semibold" : ""
                      }`}
                    >
                      Home
                    </Link>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">Tools</div>
                      {tools.map((tool) => (
                        <Link 
                          key={tool.path}
                          href={tool.path} 
                          className="block pl-4 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <i className={`${tool.icon} w-4 h-4 mr-3`}></i>
                          {tool.name}
                        </Link>
                      ))}
                    </div>

                    <Link 
                      href="/about" 
                      className={`block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                        location === "/about" ? "text-blue-600 dark:text-blue-400 font-semibold" : ""
                      }`}
                    >
                      About
                    </Link>
                    
                    <Link 
                      href="/contact" 
                      className={`block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                        location === "/contact" ? "text-blue-600 dark:text-blue-400 font-semibold" : ""
                      }`}
                    >
                      Contact
                    </Link>

                    {/* Mobile auth buttons */}
                    {!user && (
                      <div className="pt-4 space-y-2">
                        <Link href="/login">
                          <Button variant="outline" className="w-full">
                            Login
                          </Button>
                        </Link>
                        <Link href="/signup">
                          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

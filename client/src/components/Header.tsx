import { Link, useLocation } from "wouter";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { signOutUser } from "@/lib/firebase";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const { user } = useAuth();

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
          <Link href="/" className="flex items-center">
            <img 
              src={`/logo.png?v=${Date.now()}`} 
              alt="PDFo - Free Online PDF Tools Home" 
              className="h-8 w-8 object-contain" 
              style={{ height: '32px', width: '32px', objectFit: 'contain' }}
            />
          </Link>

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

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* User menu - only show if logged in */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center space-x-2"
                    aria-label="User account menu"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.displayName || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-600 dark:text-gray-300"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>
                  Access all pages and user account options
                </SheetDescription>
                <div className="flex flex-col space-y-4 mt-4">
                  <Link 
                    href="/" 
                    className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    About
                  </Link>
                  <Link 
                    href="/contact" 
                    className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Contact
                  </Link>
                  
                  {user ? (
                    <>
                      <hr className="border-gray-200 dark:border-gray-700" />
                      <Link 
                        href="/dashboard" 
                        className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Dashboard
                      </Link>
                      <Button 
                        variant="ghost" 
                        onClick={handleSignOut}
                        className="justify-start text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <hr className="border-gray-200 dark:border-gray-700" />
                      <Link href="/auth">
                        <Button variant="ghost" className="w-full justify-start text-lg">
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth">
                        <Button className="w-full text-lg">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
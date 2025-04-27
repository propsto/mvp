
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Settings } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
  userName?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated = false,
  userName = "",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-props-primary">人</span>
                <span className="ml-2 text-lg font-semibold">Props.to</span>
              </Link>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link to="/" className="text-gray-700 hover:text-props-primary px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-props-primary px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            
            {isAuthenticated ? (
              <div className="ml-4 flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button asChild variant="outline">
                  <Link to="/auth/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-props-primary hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link to="/" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              About
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                  Dashboard
                </Link>
                <Link to="/settings" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                  Settings
                </Link>
                <button className="text-gray-700 hover:bg-gray-100 block w-full text-left px-3 py-2 rounded-md text-base font-medium">
                  Log out
                </button>
              </>
            ) : (
              <div className="mt-4 space-y-2 px-3">
                <Button asChild className="w-full">
                  <Link to="/auth/login">Log in</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

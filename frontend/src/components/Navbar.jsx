import React, { useState } from 'react';
import UBLogoLight from "../assets/UBlogo-light.png";
import UBLogoDark from "../assets/UBlogo-dark.png";
import { BsMoon, BsSun } from "react-icons/bs";
import { useDarkMode } from "./DarkModeProvider.jsx";
import AccountMenu from './AccountMenu.jsx'; // Import AccountMenu component

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3">
            <img src={darkMode === "true" ? UBLogoDark : UBLogoLight} className="h-8" alt="UB Logo" />
            {/* Additional navbar content */}
        </a>
        <div className="flex items-center md:order-2">
            <button
              className="px-2 py-2 rounded-lg border-zinc-300 dark:border-zinc-600"
              onClick={toggleDarkMode}
            >
              {darkMode === "true" 
                ? <BsSun fontSize={20} className="text-white" />
                : <BsMoon fontSize={20} />
              }
            </button>
            {/* Place AccountMenu here */}
            <AccountMenu />
        </div>
        {/* Mobile menu */}
      </div>
    </nav>
  );
};

export default Navbar;

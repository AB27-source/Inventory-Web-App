import React, { useState } from 'react';
import UBLogoLight from "../assets/UBlogo-light.png";
import UBLogoDark from "../assets/UBlogo-dark.png";
import { BsMoon, BsSun } from "react-icons/bs";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={darkMode === "true" ? UBLogoDark : UBLogoLight} className="h-8" alt="UB Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"></span>
        </a>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {/* Dark Mode Toggle Button */}
            <button
              className="px-2 py-2 rounded-lg border-zinc-300 dark:border-zinc-600"
              onClick={toggleDarkMode}
            >
              {darkMode === "true" ? <BsSun fontSize={20} /> : <BsMoon fontSize={20} />}
            </button>
            {/* Other navbar items */}
            {isUserMenuOpen && (
              <div className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                {/* ... User menu ... */}
              </div>
            )}
            <button onClick={toggleMobileMenu} className="md:hidden">
              {/* ... Mobile menu button ... */}
            </button>
        </div>
        {isMobileMenuOpen && (
          <div className="w-full md:hidden">
            {/* ... Mobile menu ... */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utilities/AuthProvider.jsx";
import Transition from "../../utilities/Transition.jsx";

export default function AccountMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { username, email, authProviderLogout } = useAuth();

  const fullName = username || "Unknown User";
  const userEmail = email || "user@example.com";
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    authProviderLogout();
    navigate("/login");
  };

  // Close dropdown on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, []);

  return (
    <div className="relative inline-flex">
      {/* Avatar Button */}
      <button
        ref={dropdownRef}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-gray-700">
          {fullName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-200">
            {fullName}
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      <Transition
        show={isDropdownOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0 scale-95"
        enterEnd="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveStart="opacity-100 scale-100"
        leaveEnd="opacity-0 scale-95"
        className="origin-top-right z-10 absolute top-full right-0 min-w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg overflow-hidden mt-1"
      >
        <div className="py-1 bg-white shadow min-w-max dark:bg-gray-700 z-10">
          <div className="block px-4 py-2 text-sm text-gray-900 dark:text-white">
            <div className="font-bold break-all">{fullName}</div>
            <div className="text-gray-500 break-all">{userEmail}</div>
          </div>
          <hr className="border-gray-200 dark:border-gray-600" />
          <ul className="text-sm text-gray-700 dark:text-gray-200">
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Settings
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

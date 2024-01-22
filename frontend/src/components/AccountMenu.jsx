import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utilities/AuthProvider.jsx';

export default function AccountMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { username, email, authProviderLogout } = useAuth();

  const fullName = username || 'Unknown User';
  const userEmail = email || 'user@example.com';

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    authProviderLogout();
    navigate('/login');
  };

  return (
    <div className="relative ml-4">
      {/* Avatar Button */}
      <div
        id="avatarButton"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="cursor-pointer w-10 h-10 rounded-full flex items-center justify-center text-white bg-gray-700"
      >
        {fullName.split(' ').map(n => n[0]).join('')}
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div id="userDropdown" className="absolute right-0 mt-2 py-1 bg-white rounded-lg shadow w-48 dark:bg-gray-700 z-10">
          <div className="block px-4 py-2 text-sm text-gray-900 dark:text-white">
            <div className="font-bold">{fullName}</div>
            <div className="text-gray-500">{userEmail}</div>
          </div>
          <hr className="border-gray-200 dark:border-gray-600" /> {/* Style for divider */}
          <ul className="text-sm text-gray-700 dark:text-gray-200">
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
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
      )}
    </div>
  );
}

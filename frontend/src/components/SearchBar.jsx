import React, { useState, useEffect } from "react";
import Transition from "../utilities/Transition";

function SearchBar({ categories, onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    onSearch(
      searchTerm,
      selectedCategory === "All categories" ? "" : selectedCategory
    );
  }, [searchTerm, selectedCategory, onSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsDropdownOpen(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };
  return (
    <form onSubmit={handleSearch}>
      <div className="flex relative mb-12">
        <label
          htmlFor="search-dropdown"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Category Dropdown
        </label>
        <button
          id="dropdown-button"
          data-dropdown-toggle="dropdown"
          className="flex-shrink-0 position:fixed z-50 rounded-l-3xl inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600 overflow-hidden"
          type="button"
          style={{ width: "auto" }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedCategory}{" "}
          <svg
            className="w-2.5 h-2.5 ms-2.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        <Transition
          show={isDropdownOpen}
          enter="transition-opacity ease-out duration-200"
          enterStart="opacity-0"
          enterEnd="opacity-100"
          leave="transition-opacity ease-in duration-75"
          leaveStart="opacity-100"
          leaveEnd="opacity-0"
        >
          {/* Dropdown menu */}
          <div
            id="dropdown"
            className="absolute mt-1 bg-white divide-y divide-gray-100 rounded-3xl shadow w-44 dark:bg-gray-700 overflow-hidden" // Increase z-index significantly to ensure it's on top
            style={{ top: "100%", left: 0 }}
            aria-labelledby="dropdown-button"
          >
            {/* Dropdown items */}
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {categories.map((category, idx) => (
                <li
                  key={idx}
                  className={`${
                    idx === 0
                      ? "rounded-t-3xl"
                      : idx === categories.length - 1
                      ? "rounded-b-3xl"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Transition>
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-3xl border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white h-full"
            placeholder="Search for Inventory Items"
            required
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
}

export default SearchBar;

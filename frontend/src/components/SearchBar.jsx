import React, { useState, useEffect } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import Transition from "../utilities/Transition";

function SearchBar({ categories, onSearch, className = "" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    onSearch(
      searchTerm,
      selectedCategory === "All categories" ? "" : selectedCategory
    );
  }, [searchTerm, selectedCategory, onSearch]);

  const handleSearch = (event) => {
    event.preventDefault();
    setIsDropdownOpen(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const normalizedCategories = Array.isArray(categories) ? categories : [];

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="relative sm:w-60">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:border-emerald-400/60"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          >
            <span className="truncate">{selectedCategory}</span>
            <FiChevronDown
              className={`h-4 w-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <Transition
            show={isDropdownOpen}
            enter="transition-opacity ease-out duration-150"
            enterStart="opacity-0"
            enterEnd="opacity-100"
            leave="transition-opacity ease-in duration-100"
            leaveStart="opacity-100"
            leaveEnd="opacity-0"
          >
            <div
              className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
              role="listbox"
            >
              <ul className="max-h-60 overflow-y-auto py-1 text-sm text-slate-700 dark:text-slate-200">
                {normalizedCategories.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between px-4 py-2 text-left transition hover:bg-emerald-50 dark:hover:bg-slate-700 ${
                        category === selectedCategory
                          ? "bg-emerald-50/80 font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : ""
                      }`}
                      onClick={() => handleCategorySelect(category)}
                    >
                      <span className="truncate">{category}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Transition>
        </div>
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            id="search-dropdown"
            className="w-full rounded-2xl border border-slate-200/80 bg-white/90 py-2.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-800/90 dark:text-white"
            placeholder="Search by item name or keyword"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>
    </form>
  );
}

export default SearchBar;

import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/24/outline";

import UBLogoDark from "../assets/UBlogo-dark.png";
import UBLogoLight from "../assets/UBlogo-light.png";
import UB from "../assets/UB.png";

const navLinks = [
  { label: "Dashboard", to: "/", icon: HomeIcon },
  {
    label: "Update Requests",
    to: "/update-request-test",
    icon: ClipboardDocumentListIcon,
  },
];

const formatLabel = (label) =>
  label.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const [categories, setCategories] = useState([]);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? true : storedSidebarExpanded === "true"
  );

  const isInventoryRoute = pathname.startsWith("/inventory-management/");
  const [categoriesOpen, setCategoriesOpen] = useState(isInventoryRoute);

  useEffect(() => {
    setCategoriesOpen(isInventoryRoute);
  }, [isInventoryRoute]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/inventory/categories/"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchCategories();
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const handleCategoriesToggle = () => {
    if (!sidebarExpanded) {
      setSidebarExpanded(true);
      return;
    }
    setCategoriesOpen((prev) => !prev);
  };

  const handleSidebarExpandToggle = () => {
    setSidebarExpanded((prev) => !prev);
  };

  // --- styles ----------------------------------------------------------------
  const baseItemClasses =
    "group relative flex w-full items-center rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70";
  const navLinkClassName = (isActive) =>
    [
      baseItemClasses,
      sidebarExpanded ? "px-3 py-2 gap-3 justify-start" : "p-2 justify-center",
      isActive
        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-200"
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60",
    ].join(" ");

  const categoriesButtonClasses = [
    baseItemClasses,
    sidebarExpanded
      ? "w-full px-3 py-2 justify-between gap-3"
      : "w-full p-2 justify-center",
    isInventoryRoute || categoriesOpen
      ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-200"
      : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60",
  ].join(" ");

  // Small badge dot for collapsed state (e.g., categories count)
  const DotBadge = ({ value }) => (
    <span
      className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white"
      aria-hidden="true"
    >
      {value > 9 ? "9+" : value}
    </span>
  );

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ease-out lg:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col h-screen fixed inset-y-0 left-0 z-50 flex-shrink-0 overflow-hidden border-r border-slate-200/80 bg-white/90 shadow-xl transition-[transform,opacity,width,min-width,max-width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-transform dark:border-slate-800/70 dark:bg-slate-950/80 backdrop-blur-md lg:static lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto ${
          sidebarExpanded ? "w-72" : "w-20 min-w-[5rem] max-w-[5rem]"
        } } ${
          sidebarOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "-translate-x-full opacity-0 pointer-events-none lg:translate-x-0 lg:opacity-100"
        }`}
      >
        <div className="flex flex-col flex-1 px-3 py-5">
          {/* Header */}
          <div
            className={`flex items-center ${
              sidebarExpanded ? "justify-between px-1" : "justify-center px-0"
            }`}
          >
            {" "}
            <button
              ref={trigger}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/70 lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M10.707 18.707a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 1 1 1.414 1.414L6.414 11H20a1 1 0 1 1 0 2H6.414l4.293 4.293a1 1 0 0 1 0 1.414Z"
                />
              </svg>
            </button>
            <NavLink
              end
              to="/"
              className="flex w-full items-center justify-center"
            >
              {" "}
              {sidebarExpanded ? (
                <>
                  {/* Show light or dark logo based on theme */}
                  <img
                    src={UBLogoLight}
                    className="h-9 w-auto block dark:hidden"
                    alt="UB Logo Light"
                  />
                  <img
                    src={UBLogoDark}
                    className="h-9 w-auto hidden dark:block"
                    alt="UB Logo Dark"
                  />
                </>
              ) : (
                <img
                  src={UB}
                  className="h-9 w-auto mx-auto"
                  alt="UB Collapsed Logo"
                />
              )}
            </NavLink>
            {/* spacer to balance logo when expanded */}
            <div
              className={`transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                sidebarExpanded ? "w-10" : "w-0"
              }`}
            />{" "}
          </div>

          {/* Navigation */}
          <nav
            className={`mt-6 flex-1 space-y-8 ${
              sidebarExpanded ? "" : "flex w-full flex-col items-center"
            }`}
          >
            {" "}
            {/* Overview */}
            <div>
              <p
                className={`${
                  sidebarExpanded
                    ? "px-2 text-xs font-semibold uppercase tracking-wide text-slate-400"
                    : "sr-only"
                }`}
              >
                Overview
              </p>
              <ul className="mt-3 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.to}>
                      <NavLink
                        end
                        to={link.to}
                        aria-label={link.label}
                        className={({ isActive }) =>
                          navLinkClassName(isActive) + " relative group"
                        }
                      >
                        <div
                          className={`relative flex items-center ${
                            sidebarExpanded ? "gap-3" : ""
                          }`}
                        >
                          <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
                            <Icon className="h-6 w-6" aria-hidden="true" />
                          </span>
                          {/* label visible only when expanded */}
                          {sidebarExpanded && (
                            <span className="truncate">{link.label}</span>
                          )}
                        </div>
                        {/* tooltip for collapsed */}
                        {!sidebarExpanded && (
                          <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-white opacity-0 shadow-md transition group-hover:opacity-100">
                            {link.label}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* Inventory */}
            <div>
              <p
                className={`${
                  sidebarExpanded
                    ? "px-2 text-xs font-semibold uppercase tracking-wide text-slate-400"
                    : "sr-only"
                }`}
              >
                Inventory
              </p>
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={handleCategoriesToggle}
                  className={categoriesButtonClasses + " relative"}
                  aria-label="Categories"
                  aria-expanded={sidebarExpanded ? categoriesOpen : false}
                >
                  <div
                    className={`relative flex items-center ${
                      sidebarExpanded ? "gap-3" : ""
                    }`}
                  >
                    <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
                      <Squares2X2Icon className="h-6 w-6" aria-hidden="true" />
                      {/* show tiny dot badge when collapsed */}
                      {!sidebarExpanded && categories.length > 0 && (
                        <DotBadge value={categories.length} />
                      )}
                    </span>
                    {sidebarExpanded && (
                      <span className="truncate">Categories</span>
                    )}
                  </div>

                  {sidebarExpanded && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-5 items-center rounded-full bg-slate-200 px-2 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                        {categories.length}
                      </span>
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform duration-200 ${
                          categoriesOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  {/* tooltip for collapsed */}
                  {!sidebarExpanded && (
                    <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-white opacity-0 shadow-md transition group-hover:opacity-100">
                      Categories
                    </span>
                  )}
                </button>

                {sidebarExpanded && categoriesOpen && (
                  <ul className="ml-4 mt-2 space-y-1 border-l border-slate-200/70 pl-3 dark:border-slate-800/60">
                    {categories.length === 0 ? (
                      <li className="text-sm text-slate-400 dark:text-slate-500">
                        No categories yet
                      </li>
                    ) : (
                      categories.map((category) => {
                        const safeCategorySlug = encodeURIComponent(
                          category.name
                        );
                        const categoryPath = `/inventory-management/${safeCategorySlug}`;
                        const displayName = formatLabel(category.name);
                        return (
                          <li key={category.id}>
                            <NavLink
                              to={categoryPath}
                              className={({ isActive }) =>
                                [
                                  "block rounded-md px-3 py-1.5 text-sm transition-colors duration-200",
                                  isActive
                                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-200"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60",
                                ].join(" ")
                              }
                            >
                              {displayName}
                            </NavLink>
                          </li>
                        );
                      })
                    )}
                  </ul>
                )}
              </div>
            </div>
          </nav>

          {/* Footer / Collapse button */}
          <div className="mt-auto pt-5">
            {sidebarExpanded ? (
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 text-center text-xs text-slate-500 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-400">
                <p className="font-medium text-slate-600 dark:text-slate-200">
                  Need a new view?
                </p>
                <p className="mt-1 text-[11px]">
                  Customize categories and navigation from the settings panel.
                </p>
              </div>
            ) : (
              // vertical ellipsis for collapsed state
              <div
                className="mx-auto my-2 flex flex-col items-center gap-1 opacity-55"
                aria-hidden="true"
              >
                <span className="block h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                <span className="block h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                <span className="block h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
              </div>
            )}

            <button
              type="button"
              onClick={handleSidebarExpandToggle}
              className={`relative mt-4 ${
                sidebarExpanded
                  ? "flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                  : "mx-auto flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
              }`}
              aria-label={
                sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"
              }
            >
              {sidebarExpanded ? (
                <span>Collapse sidebar</span>
              ) : (
                <span className="sr-only">Expand sidebar</span>
              )}
              <ChevronDoubleLeftIcon
                className={`h-4 w-4 transition-transform duration-200 ${
                  sidebarExpanded ? "" : "rotate-180"
                }`}
                aria-hidden="true"
              />
              {!sidebarExpanded && (
                <span className="pointer-events-none absolute left-full bottom-6 ml-2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-white opacity-0 shadow-md transition hover:opacity-100">
                  Expand sidebar
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;

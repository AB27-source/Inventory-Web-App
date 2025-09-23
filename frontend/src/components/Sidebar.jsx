import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
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

const collapsedWidth = 80;
const expandedWidth = 288;

const DotBadge = ({ value }) => (
  <motion.span
    layout
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-semibold text-white shadow"
    aria-hidden="true"
  >
    {value > 9 ? "9+" : value}
  </motion.span>
);

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const [categories, setCategories] = useState([]);

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(min-width: 1024px)").matches;
  });
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    const stored = window.localStorage.getItem("sidebar-expanded");
    return stored === null ? true : stored === "true";
  });

  const isInventoryRoute = pathname.startsWith("/inventory-management/");
  const [categoriesOpen, setCategoriesOpen] = useState(isInventoryRoute);

  useEffect(() => {
    if (isInventoryRoute) {
      setCategoriesOpen(true);
    }
  }, [isInventoryRoute]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event) => setIsDesktop(event.matches);

    handleChange(mediaQuery);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

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
      ) {
        return;
      }
      setSidebarOpen(false);
    };

    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };

    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem("sidebar-expanded", sidebarExpanded);
    document.body.classList.toggle("sidebar-expanded", sidebarExpanded);
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

  const width = sidebarExpanded ? expandedWidth : collapsedWidth;
  const collapsed = !sidebarExpanded;

  const baseItemClasses =
    "group relative flex w-full items-center rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70";

  const navLinkClassName = (isActive) =>
    [
      baseItemClasses,
      collapsed ? "p-2 justify-center" : "px-3 py-2 gap-3 justify-start",
      isActive
        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-200"
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60",
    ].join(" ");

  const categoriesButtonClasses = [
    baseItemClasses,

    collapsed
      ? "w-full p-2 justify-center"
      : "w-full px-3 py-2 justify-between gap-3",
    isInventoryRoute || categoriesOpen
      ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-200"
      : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60",
  ].join(" ");

  return (
    <MotionConfig transition={{ type: "spring", stiffness: 300, damping: 32 }}>
      <div>
        <AnimatePresence>
          {sidebarOpen && !isDesktop && (
            <motion.button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        <motion.aside
          id="sidebar"
          ref={sidebar}
          initial={false}
          animate={{
            x: !isDesktop && !sidebarOpen ? "-100%" : 0,
            opacity: !isDesktop && !sidebarOpen ? 0 : 1,
            pointerEvents: !isDesktop && !sidebarOpen ? "none" : "auto",
            width, // animate only width
          }}
          transition={{
            x: { duration: 0.32, ease: [0.32, 0.72, 0, 1] },
            opacity: { duration: 0.2 },
            // width uses MotionConfig (spring)
          }}
          // Make layout obey your animated width on all breakpoints:
          style={{ width, flexBasis: width }} // <— key line
          className="
    fixed inset-y-0 left-0 z-50 flex h-screen flex-col overflow-hidden
    border-r border-slate-200/80 bg-white/95 shadow-xl
    dark:border-slate-800/70 dark:bg-slate-950/80
    flex-none                       /* <— not just lg: flex-none, always */
    will-change-[width]             /* <— hint to the browser */
    lg:static
    /* removed backdrop-blur from the animating element */
  "
        >
          <div className="flex flex-1 flex-col px-3 py-5">
            <div
              className={`flex items-center ${
                collapsed ? "justify-center" : "justify-between px-1"
              }`}
            >
              <button
                ref={trigger}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/70 lg:hidden"
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-controls="sidebar"
                aria-expanded={sidebarOpen}
              >
                <span className="sr-only">Toggle sidebar</span>
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
                {collapsed ? (
                  <img
                    src={UB}
                    className="mx-auto h-9 w-auto"
                    alt="UB Collapsed Logo"
                  />
                ) : (
                  <>
                    <img
                      src={UBLogoLight}
                      className="block h-9 w-auto dark:hidden"
                      alt="UB Logo Light"
                    />
                    <img
                      src={UBLogoDark}
                      className="hidden h-9 w-auto dark:block"
                      alt="UB Logo Dark"
                    />
                  </>
                )}
              </NavLink>

              <motion.div
                layout
                className={`hidden h-10 items-center justify-center transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex ${
                  collapsed ? "w-0" : "w-10"
                }`}
                aria-hidden="true"
              />
            </div>

            <nav
              className={`mt-6 flex-1 space-y-8 ${
                collapsed ? "flex flex-col items-center" : ""
              }`}
            >
              <div>
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.p
                      key="overview-heading"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400"
                    >
                      Overview
                    </motion.p>
                  )}
                </AnimatePresence>
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
                            [
                              // keep a consistent layout shell to avoid jumps
                              "group relative flex w-full items-center rounded-lg px-3 py-2 gap-3 justify-start",
                              "transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70",
                              isActive
                                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-200"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60",
                            ].join(" ")
                          }
                        >
                          <motion.span
                            layout="position"
                            className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Icon className="h-6 w-6" aria-hidden="true" />
                          </motion.span>

                          {/* KEEP label mounted; animate it closed */}
                          <motion.span
                            layout="position"
                            initial={false}
                            animate={{
                              maxWidth: collapsed ? 0 : 180, // tune 180 to your width
                              opacity: collapsed ? 0 : 1,
                              x: collapsed ? -6 : 0,
                            }}
                            transition={{
                              duration: 0.25,
                              ease: [0.2, 0.8, 0.2, 1],
                            }}
                            className="overflow-hidden whitespace-nowrap"
                          >
                            {link.label}
                          </motion.span>

                          {/* optional tooltip stays the same */}
                          {collapsed && (
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

              <div>
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.p
                      key="inventory-heading"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400"
                    >
                      Inventory
                    </motion.p>
                  )}
                </AnimatePresence>
                <div className="mt-3 space-y-2">
                  <motion.button
                    type="button"
                    onClick={handleCategoriesToggle}
                    className={categoriesButtonClasses + " relative"}
                    aria-label="Categories"
                    aria-expanded={sidebarExpanded ? categoriesOpen : false}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`relative flex items-center ${
                        collapsed ? "" : "gap-3"
                      }`}
                    >
                      <motion.span
                        layout
                        className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Squares2X2Icon
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                        <AnimatePresence>
                          {collapsed && categories.length > 0 && (
                            <DotBadge value={categories.length} />
                          )}
                        </AnimatePresence>
                      </motion.span>
                      <AnimatePresence initial={false}>
                        {!collapsed && (
                          <motion.span
                            key="categories-label"
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            className="truncate"
                          >
                            Categories
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    {!collapsed && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-5 items-center rounded-full bg-slate-200 px-2 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                          {categories.length}
                        </span>
                        <motion.span
                          animate={{ rotate: categoriesOpen ? 180 : 0 }}
                          className="inline-flex"
                        >
                          <ChevronDownIcon
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </motion.span>
                      </div>
                    )}

                    {collapsed && (
                      <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-white opacity-0 shadow-md transition group-hover:opacity-100">
                        Categories
                      </span>
                    )}
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {sidebarExpanded && categoriesOpen && (
                      <motion.ul
                        key="category-list"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: "auto" },
                          collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="ml-4 mt-2 space-y-1 border-l border-slate-200/70 pl-3 dark:border-slate-800/60"
                      >
                        {categories.length === 0 ? (
                          <motion.li
                            className="text-sm text-slate-400 dark:text-slate-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            No categories yet
                          </motion.li>
                        ) : (
                          categories.map((category, index) => {
                            const safeCategorySlug = encodeURIComponent(
                              category.name
                            );
                            const categoryPath = `/inventory-management/${safeCategorySlug}`;
                            const displayName = formatLabel(category.name);
                            return (
                              <motion.li
                                key={category.id}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: index * 0.04,
                                  duration: 0.25,
                                }}
                              >
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
                              </motion.li>
                            );
                          })
                        )}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </nav>

            <div className="mt-auto pt-5">
              <AnimatePresence initial={false}>
                {collapsed ? (
                  <motion.div
                    key="collapsed-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.55 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mx-auto my-2 flex flex-col items-center gap-1"
                    aria-hidden="true"
                  >
                    <span className="block h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                    <span className="block h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                    <span className="block h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="expanded-footer"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 text-center text-xs text-slate-500 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-400"
                  >
                    <p className="font-medium text-slate-600 dark:text-slate-200">
                      Need a new view?
                    </p>
                    <p className="mt-1 text-[11px]">
                      Customize categories and navigation from the settings
                      panel.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={handleSidebarExpandToggle}
                className={`relative mt-4 ${
                  collapsed
                    ? "mx-auto flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                    : "flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                }`}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      key="collapse-label"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                    >
                      Collapse sidebar
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.span animate={{ rotate: collapsed ? 180 : 0 }}>
                  <ChevronDoubleLeftIcon
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </motion.span>
                {collapsed && (
                  <span className="pointer-events-none absolute left-full bottom-6 ml-2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-white opacity-0 shadow-md transition group-hover:opacity-100">
                    Expand sidebar
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </motion.aside>
      </div>
    </MotionConfig>
  );
}

export default Sidebar;

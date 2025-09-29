import React from "react";
import { useLocation } from "react-router-dom";
import {
  Bars3Icon,
  BellIcon,
  QuestionMarkCircleIcon,
  PlusIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import AccountMenu from "./AccountMenu.jsx";
import DarkModeToggle from "../../utilities/DarkModeToggle.jsx";

// Define SearchModal, Notifications, Help, UserMenu, ThemeToggle if needed.
const routeTitleOverrides = {
  "/": "Dashboard",
  "/update-request-test": "Update Requests",
};

const segmentLabelOverrides = {
  "inventory-management": "Inventory",
  "update-request-test": "Update Requests",
};

const formatSegment = (segment) =>
  segment.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const buildBreadcrumbs = (pathname) => {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: routeTitleOverrides["/"], path: "/" }];
  }

  const crumbs = [{ label: routeTitleOverrides["/"], path: "/" }];

  segments.forEach((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`;
    const decodedSegment = decodeURIComponent(segment);
    const override =
      routeTitleOverrides[path] ??
      segmentLabelOverrides[segment] ??
      segmentLabelOverrides[decodedSegment];
    const label = override ?? formatSegment(decodedSegment);
    crumbs.push({ label, path });
  });

  return crumbs;
};

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const breadcrumbs = buildBreadcrumbs(pathname);
  const currentTitle =
    routeTitleOverrides[pathname] ??
    (breadcrumbs.length
      ? breadcrumbs[breadcrumbs.length - 1].label
      : routeTitleOverrides["/"]);
  const contextLabel =
    breadcrumbs.length > 1
      ? breadcrumbs[breadcrumbs.length - 2].label
      : "Overview";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-gradient-to-r from-white via-slate-50 to-white text-slate-900 backdrop-blur supports-[backdrop-filter]:bg-white/85 shadow-lg dark:border-slate-900/30 dark:from-slate-950/95 dark:via-slate-900/90 dark:to-slate-950/95 dark:text-white">
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-4 py-4 sm:flex-nowrap sm:gap-6">
          {/* Header: Left side */}

          <button
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100/80 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
                {contextLabel}
              </span>
              <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="truncate text-xl font-semibold text-slate-900 dark:text-white">
                  {currentTitle}
                </h1>
                {breadcrumbs.length > 1 && (
                  <nav className="hidden items-center text-[13px] font-medium text-slate-500 dark:text-slate-400 sm:flex">
                    {breadcrumbs.map((crumb, index) => (
                      <React.Fragment key={`${crumb.path}-${index}`}>
                        {index > 0 && (
                          <ChevronRightIcon
                            className="mx-1 h-3.5 w-3.5 text-slate-300 dark:text-slate-600"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={
                            index === breadcrumbs.length - 1
                              ? "text-slate-700 dark:text-slate-200"
                              : "transition hover:text-slate-700 dark:hover:text-slate-200"
                          }
                        >
                          {crumb.label}
                        </span>
                      </React.Fragment>
                    ))}
                  </nav>
                )}
              </div>
            </div>
          </div>

          {/* Header: Right side */}
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap sm:gap-3">
            <button
              type="button"
              className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/30 transition hover:from-indigo-400 hover:via-purple-500 hover:to-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70 sm:inline-flex"
            >
              <PlusIcon className="h-4 w-4" aria-hidden="true" />
              <span>New Item</span>
            </button>

            <div className="flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-white/80 px-1.5 py-1 shadow-sm shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:shadow-black/10">
              <DarkModeToggle variant="minimal" />
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="View notifications"
              >
                <BellIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Get help"
              >
                <QuestionMarkCircleIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </button>
            </div>

            <div
              className="hidden h-6 w-px bg-slate-200 sm:block dark:bg-white/10"
              aria-hidden="true"
            />

            <div className="flex-shrink-0">
              <AccountMenu align="right" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

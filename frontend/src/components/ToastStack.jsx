import React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const toneStyles = {
  success: {
    border: "border-emerald-200/70 dark:border-emerald-500/40",
    bg: "bg-emerald-50/90 dark:bg-emerald-500/10",
    icon: "text-emerald-500 dark:text-emerald-300",
    accent: "from-emerald-400/30",
  },
  error: {
    border: "border-rose-200/80 dark:border-rose-500/40",
    bg: "bg-rose-50/95 dark:bg-rose-500/10",
    icon: "text-rose-500 dark:text-rose-300",
    accent: "from-rose-500/30",
  },
  warning: {
    border: "border-amber-200/80 dark:border-amber-500/40",
    bg: "bg-amber-50/95 dark:bg-amber-500/10",
    icon: "text-amber-500 dark:text-amber-300",
    accent: "from-amber-500/30",
  },
  info: {
    border: "border-sky-200/80 dark:border-sky-500/40",
    bg: "bg-sky-50/95 dark:bg-sky-500/10",
    icon: "text-sky-500 dark:text-sky-300",
    accent: "from-sky-500/30",
  },
};

const toneIcon = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  warning: ExclamationCircleIcon,
  info: InformationCircleIcon,
};

const ToastStack = ({ toasts, onDismiss }) => {
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 flex max-w-full flex-col gap-3 sm:top-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((toast) => {
          const tone = toneStyles[toast.tone ?? "info"];
          const Icon = toneIcon[toast.tone ?? "info"];

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.6 }}
              className="pointer-events-auto"
            >
              <div
                className={`relative overflow-hidden rounded-3xl border bg-white/90 px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur dark:bg-slate-900/80 dark:shadow-black/30 ${tone.border}`}
                role="status"
                aria-live="polite"
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 -top-12 h-24 bg-gradient-to-b ${tone.accent} via-transparent to-transparent blur-2xl`}
                  aria-hidden="true"
                />
                <div className="relative flex items-start gap-3">
                  <span
                    className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/70 shadow-sm shadow-white/30 dark:bg-white/10 ${tone.icon}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="flex-1">
                    {toast.title && (
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">
                        {toast.title}
                      </p>
                    )}
                    {toast.description && (
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {toast.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onDismiss(toast.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-slate-400 transition hover:border-slate-200 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200"
                    aria-label="Dismiss notification"
                  >
                    <XMarkIcon className="h-4.5 w-4.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastStack;

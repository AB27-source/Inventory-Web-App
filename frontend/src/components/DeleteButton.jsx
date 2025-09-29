import React from "react";
import { AnimatePresence, motion } from "motion/react";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isProcessing = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="delete-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center p-4 sm:p-6"
          aria-labelledby="confirm-delete-title"
          role="dialog"
          aria-modal="true"
        >
          <motion.button
            type="button"
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
          />

          <motion.div
            layout
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 26, mass: 0.7 }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/85 dark:shadow-black/40 sm:p-7">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.28, ease: "easeOut" }}
                className="absolute inset-x-0 -top-20 h-44 bg-gradient-to-b from-rose-500/25 via-transparent to-transparent blur-3xl"
                aria-hidden="true"
              />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-rose-500/90 dark:text-rose-300/90">
                    Danger Zone
                  </p>
                  <h2
                    id="confirm-delete-title"
                    className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
                  >
                    Delete Item
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/70 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60 dark:border-white/10 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.75 4.75L15.25 15.25M4.75 15.25L15.25 4.75"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04, duration: 0.28, ease: "easeOut" }}
                className="mt-5 space-y-4"
              >
                <div className="rounded-2xl border border-rose-100/60 bg-rose-50/70 px-4 py-3 text-sm text-rose-700 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                  <p>
                    Are you sure you want to delete
                    <span className="font-semibold text-rose-600 dark:text-rose-200">
                      {" "}
                      {itemName ? `"${itemName}"` : "this item"}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 px-6 py-2 text-sm font-semibold text-white shadow shadow-rose-500/40 transition hover:from-rose-400 hover:via-red-500 hover:to-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;

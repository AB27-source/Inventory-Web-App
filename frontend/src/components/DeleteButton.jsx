import React from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? "" : "hidden"}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="fixed inset-0 bg-slate-950 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        {/* modal container */}
        <div className="inline-block align-middle bg-white dark:bg-gray-700 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center pb-3">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                    id="modal-title"
                  >
                    Confirm Deletion
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 dark:text-gray-200 hover:text-gray-500 dark:hover:text-white focus:outline-none"
                  >
                    {/* Close Icon */}
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 mb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete the item "{itemName}"? This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-end pt-4 space-x-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;

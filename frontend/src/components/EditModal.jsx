import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import API from "../utilities/Axios";
import { updateInventoryItem } from "../utilities/InventoryAPI";
import { useAuth } from "../utilities/AuthProvider";

const EditModal = ({ isOpen, onClose, item, onSave, onError }) => {
  const { tokens, role } = useAuth();
  const accessToken = tokens?.access;
  const isEmployee = role === "employee";

  const buttonText = isEmployee ? "Request Changes" : "Save Changes";

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    quantity: 1,
    recommended_quantity: 0,
    warning_quantity: 0,
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        name: item.name ?? "",
        price: item.price ?? "",
        category: item.category ?? "",
        quantity: Number(item.quantity ?? 1),
        recommended_quantity: Number(item.recommended_quantity ?? 0),
        warning_quantity: Number(item.warning_quantity ?? 0),
      });
    }
  }, [item, isOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get("/inventory/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      if (name === "quantity") {
        const numericValue = Number(value);
        return {
          ...prevState,
          quantity: Number.isNaN(numericValue) ? 0 : numericValue,
        };
      }

      if (name === "recommended_quantity") {
        const numericValue = Number(value);
        const sanitizedValue = Number.isNaN(numericValue) ? 0 : numericValue;
        const warningValue = prevState.warning_quantity;
        const adjustedWarning =
          typeof warningValue === "number" && warningValue > sanitizedValue
            ? sanitizedValue
            : warningValue;

        return {
          ...prevState,
          recommended_quantity: sanitizedValue,
          warning_quantity: adjustedWarning,
        };
      }

      if (name === "warning_quantity") {
        const numericValue = Number(value);
        const sanitizedValue = Number.isNaN(numericValue) ? 0 : numericValue;
        const recommendedValue = prevState.recommended_quantity;
        const clampedValue =
          typeof recommendedValue === "number"
            ? Math.min(sanitizedValue, recommendedValue)
            : sanitizedValue;

        return {
          ...prevState,
          warning_quantity: clampedValue,
        };
      }

      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData);

    try {
      setIsSubmitting(true);
      console.log(tokens);
      const updatedItem = await updateInventoryItem(
        item.id,
        formData,
        accessToken
      );
      console.log("Updated item:", updatedItem);
      onSave(updatedItem);
      onClose();
    } catch (error) {
      console.error("Error updating inventory item:", error);
      if (onError) {
        onError(error);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="edit-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center p-4 sm:p-6"
          aria-labelledby="edit-item-title"
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
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          <motion.div
            layout
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 28,
              mass: 0.7,
            }}
            className="relative z-10 w-full max-w-xl"
          >
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/40 sm:p-8">
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.3, ease: "easeOut" }}
                className="absolute inset-x-0 -top-20 h-40 bg-gradient-to-b from-indigo-500/20 via-transparent to-transparent blur-3xl"
                aria-hidden="true"
              />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
                    Edit Product
                  </p>
                  <h2
                    id="edit-item-title"
                    className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white"
                  >
                    {formData.name || "Inventory Item"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/70 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60 dark:border-white/10 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
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

              <motion.form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04, duration: 0.3, ease: "easeOut" }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                  htmlFor="name"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Type product name"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  name="quantity"
                  id="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
                  placeholder="Quantity"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  Price
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="recommended_quantity"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  Recommended Quantity
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  name="recommended_quantity"
                  id="recommended_quantity"
                  value={formData.recommended_quantity}
                  onChange={handleChange}
                  min="0"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
                  placeholder="0"
                  required
                  disabled={isEmployee || isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="warning_quantity"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  Warning Quantity
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  name="warning_quantity"
                  id="warning_quantity"
                  value={formData.warning_quantity}
                  onChange={handleChange}
                  min="0"
                  max={formData.recommended_quantity}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
                  placeholder="0"
                  required
                  disabled={isEmployee || isSubmitting}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="category"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-2 w-full appearance-none rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-800/60 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
                  required
                  disabled={isSubmitting}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow shadow-indigo-500/40 transition hover:from-indigo-400 hover:via-purple-500 hover:to-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : buttonText}
              </button>
            </div>
          </motion.form>
        </div>
      </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditModal;

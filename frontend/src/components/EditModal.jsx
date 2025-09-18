import React, { useState, useEffect } from "react";
import API from "../utilities/Axios";
import { updateInventoryItem } from "../utilities/InventoryAPI";
import { useAuth } from "../utilities/AuthProvider";

const EditModal = ({ isOpen, onClose, item, onSave }) => {
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
    }
  };

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
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center pb-3">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                    id="modal-title"
                  >
                    Edit Product
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      placeholder="Type product name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      placeholder="Enter quantity"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="recommended_quantity"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Recommended Quantity
                    </label>
                    <input
                      type="number"
                      name="recommended_quantity"
                      id="recommended_quantity"
                      value={formData.recommended_quantity}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      placeholder="Enter recommended quantity"
                      min="0"
                      required
                      disabled={isEmployee}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="warning_quantity"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Warning Quantity
                    </label>
                    <input
                      type="number"
                      name="warning_quantity"
                      id="warning_quantity"
                      value={formData.warning_quantity}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      placeholder="Enter warning quantity"
                      min="0"
                      max={formData.recommended_quantity}
                      required
                      disabled={isEmployee}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      placeholder="Enter price"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Category
                    </label>
                    <select
                      name="category"
                      id="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      required
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end pt-4 space-x-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      {buttonText}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;

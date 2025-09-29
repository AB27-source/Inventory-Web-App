import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../utilities/AuthProvider";
import MainLayout from "../components/MainLayout";
import API from "../utilities/Axios";
import EditModal from "../components/EditModal";
import ConfirmDeleteModal from "../components/DeleteButton";
import ToastStack from "../components/ToastStack";
import { deleteInventoryItem } from "../utilities/InventoryAPI";
import SkeletonLoader from "../components/SkeletonLoader";
import { FaSort } from "react-icons/fa";

const formatCategoryLabel = (rawCategory) =>
  decodeURIComponent(rawCategory || "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatPrice = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numeric);
};

const formatTimestamp = (value, options = { dateStyle: "medium" }) => {
  if (!value) {
    return "Just now";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Just now";
  }

  return parsed.toLocaleString(undefined, options);
};

const InventoryManagement = () => {
  const { category } = useParams();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const { role } = useAuth();
  const formattedCategory = formatCategoryLabel(category);

  const openEditModal = (item) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const saveItem = (updatedItem) => {
    setInventoryItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    closeEditModal();
  };

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const toastTimeoutsRef = useRef([]);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    toastTimeoutsRef.current = toastTimeoutsRef.current.filter((entry) => {
      if (entry.id === id) {
        window.clearTimeout(entry.timeoutId);
        return false;
      }
      return true;
    });
  };

  const pushToast = ({ title, description, tone = "info" }) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, title, description, tone }]);

    const timeoutId = window.setTimeout(() => {
      dismissToast(id);
    }, 5000);
    toastTimeoutsRef.current.push({ id, timeoutId });
  };

  useEffect(() => () => {
    toastTimeoutsRef.current.forEach(({ timeoutId }) => window.clearTimeout(timeoutId));
  }, []);

  const openConfirmModal = (itemId) => {
    setItemToDelete(itemId);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setItemToDelete(null);
    setIsDeleting(false);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      setIsDeleting(true);
      try {
        await deleteInventoryItem(itemToDelete);
        setInventoryItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemToDelete)
        );
        closeConfirmModal();
      } catch (error) {
        console.error("Error deleting inventory item:", error);
        const status = error?.response?.status;
        if (status === 401) {
          pushToast({
            tone: "error",
            title: "Delete failed",
            description: "You need to sign in before deleting inventory items.",
          });
        } else {
          pushToast({
            tone: "error",
            title: "Delete failed",
            description: "We couldn't delete the item. Please try again.",
          });
        }
        closeConfirmModal();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditError = (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      pushToast({
        tone: "error",
        title: "Save failed",
        description: "You need to sign in before editing inventory items.",
      });
    } else {
      pushToast({
        tone: "error",
        title: "Save failed",
        description: "We couldn't update the item. Please try again.",
      });
    }
  };

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const sortedItems = useMemo(() => {
    let sortableItems = [...inventoryItems]; // Create a copy of the inventory items
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [inventoryItems, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getRowClassName = (item, index) => {
    const quantityValue = Number(item.quantity);
    const warningValue = Number(item.warning_quantity);
    const recommendedValue = Number(item.recommended_quantity);

    const baseRow = "transition-colors duration-200 border-b";
    const defaultRow = [
      baseRow,
      index % 2 === 0
        ? "bg-white dark:bg-slate-900/40"
        : "bg-slate-50 dark:bg-slate-900/30",
      "border-slate-200/70 hover:bg-slate-100 dark:border-white/5 dark:hover:bg-slate-800/50",
    ].join(" ");

    const isBelowWarning =
      !Number.isNaN(warningValue) &&
      warningValue > 0 &&
      quantityValue <= warningValue;

    if (isBelowWarning) {
      return [
        baseRow,
        "border-red-200 bg-red-100 text-red-700 hover:bg-red-200",
        "dark:border-red-500/40 dark:bg-red-950/70 dark:text-red-200 dark:hover:bg-red-900/70",
      ].join(" ");
    }

    const isBelowRecommended =
      !Number.isNaN(recommendedValue) &&
      recommendedValue > 0 &&
      quantityValue <= recommendedValue;

    if (isBelowRecommended) {
      return [
        baseRow,
        "border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-200/60",
        "dark:border-amber-500/30 dark:bg-amber-950/60 dark:text-amber-200 dark:hover:bg-amber-900/60",
      ].join(" ");
    }

    return defaultRow;
  };

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);

      const categoryURL = `inventory/items/category/${encodeURIComponent(
        category
      )}/`;

      console.log("Fetching items from:", categoryURL);
      try {
        const response = await API.get(categoryURL);
        console.log("API Response:", response.data);
        setInventoryItems(response.data);
      } catch (error) {
        console.error(
          "Error fetching inventory items from category:",
          category,
          error
        );
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchItems();
  }, [category]);

  // if (loading) {
  //   return <SkeletonLoader />;
  // }

  return (
    <MainLayout>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        item={currentItem}
        onSave={saveItem}
        onError={handleEditError}
      />
      <section className="relative isolate flex min-h-full flex-col overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-100 px-4 pt-6 pb-12 text-slate-900 sm:px-6 sm:pt-8 lg:px-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-200">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-indigo-500/10 via-indigo-500/5 to-transparent blur-3xl" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
          <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
                Inventory Management
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                {formattedCategory}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                Monitor stock, pricing, and thresholds for the {formattedCategory.toLowerCase()} category.
              </p>
            </div>

            <div className="flex shrink-0 gap-4">
              <div className="rounded-3xl border border-slate-200/70 bg-white px-5 py-4 text-right shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-white/5 dark:shadow-black/10">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Items Tracked
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  {inventoryItems.length}
                </p>
              </div>
              <div className="hidden rounded-3xl border border-slate-200/70 bg-white px-5 py-4 text-right shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-white/5 dark:shadow-black/10 sm:block">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Last Sync
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-200">
                  {sortedItems.length > 0
                    ? formatTimestamp(sortedItems[0].updated_at ?? sortedItems[0].created_at ?? Date.now(), {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Awaiting data"}
                </p>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="flex h-[320px] items-center justify-center rounded-3xl border border-slate-200/70 bg-white/80 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900/40 dark:shadow-black/20">
              <SkeletonLoader />
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-xl shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:shadow-black/20">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] divide-y divide-slate-200/70 text-left text-sm text-slate-600 dark:divide-white/5 dark:text-slate-200">
                  <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/60 dark:text-slate-300">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-semibold">
                        <button
                          type="button"
                          onClick={() => requestSort("name")}
                          className="group flex w-full items-center justify-between text-left"
                        >
                          <span>Item Name</span>
                          <FaSort
                            className="ml-2 h-3.5 w-3.5 text-slate-400 transition group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300"
                            aria-hidden="true"
                          />
                        </button>
                      </th>
                      <th scope="col" className="px-6 py-4 font-semibold">
                        <button
                          type="button"
                          onClick={() => requestSort("quantity")}
                          className="group flex w-full items-center justify-between text-left"
                        >
                          <span>Quantity</span>
                          <FaSort
                            className="ml-2 h-3.5 w-3.5 text-slate-400 transition group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300"
                            aria-hidden="true"
                          />
                        </button>
                      </th>
                      <th scope="col" className="px-6 py-4 font-semibold">
                        <button
                          type="button"
                          onClick={() => requestSort("price")}
                          className="group flex w-full items-center justify-between text-left"
                        >
                          <span>Price</span>
                          <FaSort
                            className="ml-2 h-3.5 w-3.5 text-slate-400 transition group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300"
                            aria-hidden="true"
                          />
                        </button>
                      </th>
                      <th scope="col" className="px-6 py-4 font-semibold">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-4 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
                    {sortedItems.map((item, index) => (
                      <tr key={item.id} className={getRowClassName(item, index)}>
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-200">
                          <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Last updated: {formatTimestamp(item.updated_at ?? item.created_at ?? Date.now())}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-base font-medium text-slate-700 dark:text-slate-200">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-base font-semibold text-emerald-600 dark:text-emerald-300">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-300">
                          {item.category || formattedCategory}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-5 text-sm font-semibold">
                            <button
                              onClick={() => openEditModal(item)}
                              className="text-sky-600 transition hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200"
                            >
                              Edit
                            </button>
                            {role !== "employee" && (
                              <button
                                onClick={() => openConfirmModal(item.id)}
                                className="text-rose-600 transition hover:text-rose-700 dark:text-rose-300 dark:hover:text-rose-200"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {sortedItems.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-24 text-center text-sm font-medium text-slate-500 dark:text-slate-400"
                        >
                          No inventory items found for this category yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
      <ConfirmDeleteModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDeleteConfirm}
        itemName={currentItem ? currentItem.name : ""}
        isProcessing={isDeleting}
      />
    </MainLayout>
  );
};

export default InventoryManagement;

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../utilities/AuthProvider";
import MainLayout from "../components/MainLayout";
import API from "../utilities/Axios";
import EditModal from "../components/EditModal";
import ConfirmDeleteModal from "../components/DeleteButton";
import { deleteInventoryItem } from "../utilities/InventoryAPI";
import SkeletonLoader from "../components/SkeletonLoader";
import { FaSort } from "react-icons/fa";

const InventoryManagement = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const { role } = useAuth();

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

  const openConfirmModal = (itemId) => {
    setItemToDelete(itemId);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await deleteInventoryItem(itemToDelete);
        setInventoryItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemToDelete)
        );
        closeConfirmModal();
      } catch (error) {
        console.error("Error deleting inventory item:", error);
      }
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

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const categoryURL = `inventory/items/category/${encodeURIComponent(
        category
      )}/`;

      console.log("Fetching items from:", categoryURL); // Log the URL being used
      try {
        const response = await API.get(categoryURL);
        console.log("API Response:", response.data); // Log the data received from the API
        setInventoryItems(response.data);
      } catch (error) {
        console.error(
          "Error fetching inventory items from category:",
          category,
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [category]); // Depend on category to refetch when it changes

  // if (loading) {
  //   return <SkeletonLoader />;
  // }

  return (
    <MainLayout>
      <EditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        item={currentItem}
        onSave={saveItem}
      />
      <div className="p-4 sm:px-6 lg:px-8">
        <h1 className="text-lg leading-6 font-medium text-black dark:text-white">
          Inventory Management - {category}
        </h1>
        <div className="mt-6">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => requestSort("name")}
                  >
                    <div className="flex items-center justify-between">
                      Item Name <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => requestSort("quantity")}
                  >
                    <div className="flex items-center justify-between">
                      Quantity <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => requestSort("price")}
                  >
                    <div className="flex items-center justify-between">
                      Price <FaSort />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">${item.price}</td>
                    <td className="px-6 py-4">{item.category}</td>
                    <td
                      className={`px-6 py-4 ${
                        role !== "employee" ? "flex justify-between" : ""
                      }`}
                    >
                      <button
                        onClick={() => openEditModal(item)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-auto"
                      >
                        Edit
                      </button>
                      {role !== "employee" && (
                        <button
                          onClick={() => openConfirmModal(item.id)}
                          className="font-medium text-red-600 dark:text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDeleteConfirm}
        itemName={currentItem ? currentItem.name : ""}
      />
    </MainLayout>
  );
};

export default InventoryManagement;

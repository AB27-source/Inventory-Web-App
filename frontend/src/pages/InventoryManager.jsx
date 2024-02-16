import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import API from "../utilities/Axios";
import EditModal from "../components/EditModal";
import ConfirmDeleteModal from "../components/DeleteButton";
import { deleteInventoryItem } from "../utilities/InventoryAPI";
import { FaSort } from "react-icons/fa";

const InventoryManagement = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

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

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/inventory/items/`, {
          params: { category: category },
        });
        setInventoryItems(response.data);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [category]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
                  {/* Column headers */}
                  <th scope="col" className="px-6 py-3">
                    Item Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
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
                {inventoryItems.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">${item.price}</td>
                    <td className="px-6 py-4">{item.category}</td>
                    <td className="px-6 py-4 flex items-center">
                      <button
                        onClick={() => openEditModal(item)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openConfirmModal(item.id)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline ml-3"
                      >
                        Delete
                      </button>
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

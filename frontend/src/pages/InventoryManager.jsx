import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import API from "../utilities/Axios";
import { FaSort } from "react-icons/fa"; // Make sure to import FaSort

const InventoryManagement = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        // Note the use of params here to pass the category as a query parameter
        const response = await API.get(`/inventory/items/`, { params: { category: category } });
        setInventoryItems(response.data);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
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
                        onClick={() => navigate(`/edit-item/${item.id}`)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          /* Function to handle delete */
                        }}
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
    </MainLayout>
  );
};

export default InventoryManagement;

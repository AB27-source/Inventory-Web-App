import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import DashboardCard from "../components/DashboardCard";
import API from "../utilities/Axios";

function Dashboard() {
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await API.get("inventory/items/");
        setInventoryItems(response.data);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    };

    fetchInventoryItems();
  }, []);

  // Group items by category
  const itemsByCategory = inventoryItems.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-slate-200 dark:bg-slate-900 px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.keys(itemsByCategory).map((category) => (
            <DashboardCard key={category} category={category} items={itemsByCategory[category]} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;

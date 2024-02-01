import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import DashboardCard from "../components/DashboardCard";
import SearchBar from "../components/SearchBar";
import API from "../utilities/Axios";

function Dashboard() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState(["All categories"]);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await API.get("inventory/items/");
        setInventoryItems(response.data);
        setFilteredItems(response.data);

        const uniqueCategories = Array.from(
          new Set(response.data.map((item) => item.category))
        );
        setCategories(["All categories", ...uniqueCategories]);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    };

    fetchInventoryItems();
  }, []);

  // Search handler
  const handleSearch = (searchTerm, category) => {
    let filtered = inventoryItems.filter(
      (item) =>
        (category === "" || item.category === category) &&
        (searchTerm === "" ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredItems(filtered);
  };

  // Group items by category
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-slate-200 dark:bg-slate-900 px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <SearchBar
          categories={categories} // static list of categories
          onSearch={handleSearch}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.keys(itemsByCategory).map((category) => (
            <DashboardCard
              key={category}
              category={category}
              items={itemsByCategory[category]}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;

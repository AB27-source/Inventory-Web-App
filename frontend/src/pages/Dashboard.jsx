import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; 
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

  // Search handler wrapped with useCallback
  const handleSearch = useCallback(
    (searchTerm, category) => {
      let filtered = inventoryItems.filter(
        (item) =>
          (category === "" || item.category === category) &&
          (searchTerm === "" ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredItems(filtered);
    },
    [inventoryItems]
  );

  const itemsByCategory = filteredItems.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/inventory-management/${categoryName}`);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-slate-200 dark:bg-slate-900 px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="static z-40">
          <SearchBar
            categories={categories} // static list of categories
            onSearch={handleSearch}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.keys(itemsByCategory).map((category) => (
            <DashboardCard
              key={category}
              category={category}
              items={itemsByCategory[category]}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;

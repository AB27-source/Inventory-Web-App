import React, { useState } from "react";
import { FaSort } from "react-icons/fa";

function DashboardCard({ category, items, onClick }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const maxVisibleItems = 4;

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
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
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleCategoryHeaderClick = () => {
    if (onClick) {
      onClick(category);
    }
  };

  const getRowClassName = (item, index) => {
    const quantityValue = Number(item.quantity);
    const warningValue = Number(item.warning_quantity);
    const recommendedValue = Number(item.recommended_quantity);

    const defaultRow = `${
      index % 2 === 0
        ? "bg-slate-50 dark:bg-slate-800"
        : "bg-white dark:bg-slate-700"
    } hover:bg-slate-100 dark:hover:bg-slate-600`;

    const isBelowWarning =
      !Number.isNaN(warningValue) &&
      warningValue > 0 &&
      quantityValue <= warningValue;
    if (isBelowWarning) {
      return "bg-red-100 hover:bg-red-200 dark:bg-red-900/60 dark:hover:bg-red-900/80";
    }

    const isBelowRecommended =
      !Number.isNaN(recommendedValue) &&
      recommendedValue > 0 &&
      quantityValue <= recommendedValue;
    if (isBelowRecommended) {
      return "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/60 dark:hover:bg-yellow-900/80";
    }

    return defaultRow;
  };

  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2
          className="font-semibold text-slate-800 dark:text-slate-100 cursor-pointer"
          onClick={handleCategoryHeaderClick}
        >
          {category}
        </h2>
      </header>
      <div className="p-3">
        {/* Only apply 'overflow-y-auto' when there are too many items ✅ */}
        <div
          className={`overflow-x-auto ${
            sortedItems.length > maxVisibleItems
              ? "overflow-y-auto max-h-[250px]"
              : ""
          } scrollbar-thin`}
        >
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700 sticky top-0 z-10">
              <tr>
                <th
                  className="px-6 py-3 w-1/4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center justify-start">
                    Item Name <FaSort className="ml-2" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 w-1/4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("quantity")}
                >
                  <div className="flex items-center justify-center">
                    Quantity <FaSort className="ml-2" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 w-1/4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("price")}
                >
                  <div className="flex items-center justify-center">
                    Price <FaSort className="ml-2" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 w-1/4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("last_updated")}
                >
                  <div className="flex items-center justify-center">
                    Last Updated <FaSort className="ml-2" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {sortedItems.map((item, index) => {
                const date = new Date(item.last_updated);
                const formattedDate = date.toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr
                    key={item.id}
                    className={getRowClassName(item, index)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-900 dark:text-white">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-emerald-500">
                      ${item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-900 dark:text-white">
                      {formattedDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;

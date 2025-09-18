import React, { useMemo, useState } from "react";
import { FaSort } from "react-icons/fa";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const statusConfig = {
  critical: {
    label: "Critical",
    description: "At or below the alert threshold",
    badgeClass:
      "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-300",
    barClass: "bg-red-500",
  },
  warning: {
    label: "Low",
    description: "Below the recommended par level",
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
    barClass: "bg-amber-500",
  },
  healthy: {
    label: "Healthy",
    description: "Within comfortable stock levels",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
    barClass: "bg-emerald-500",
  },
};

const getItemStatus = (item) => {
  const quantityValue = Number(item.quantity);
  const warningValue = Number(item.warning_quantity);
  const recommendedValue = Number(item.recommended_quantity);

  if (!Number.isNaN(warningValue) && warningValue > 0 && quantityValue <= warningValue) {
    return "critical";
  }

  if (
    !Number.isNaN(recommendedValue) &&
    recommendedValue > 0 &&
    quantityValue <= recommendedValue
  ) {
    return "warning";
  }

  return "healthy";
};

const getProgressPercentage = (item) => {
  const quantity = Number(item.quantity);
  const recommended = Number(item.recommended_quantity);

  if (Number.isNaN(quantity)) {
    return 0;
  }

  if (Number.isNaN(recommended) || recommended <= 0) {
    return quantity > 0 ? 100 : 0;
  }

  return Math.max(0, Math.min(100, Math.round((quantity / recommended) * 100)));
};

function DashboardCard({ category, items, onClick }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const maxVisibleItems = 6;

  const sortedItems = useMemo(() => {
    const sortableItems = [...items];
    if (sortConfig.key !== null) {
      const { key, direction } = sortConfig;
      const statusPriority = { critical: 0, warning: 1, healthy: 2 };

      sortableItems.sort((a, b) => {
        let aValue;
        let bValue;

        if (key === "status") {
          aValue = statusPriority[getItemStatus(a)];
          bValue = statusPriority[getItemStatus(b)];
        } else if (key === "last_updated") {
          aValue = new Date(a.last_updated).getTime();
          bValue = new Date(b.last_updated).getTime();
        } else if (key === "price") {
          aValue = Number(a.price);
          bValue = Number(b.price);
        } else {
          aValue = a[key];
          bValue = b[key];
        }

        if (aValue === undefined || aValue === null) {
          return 1;
        }
        if (bValue === undefined || bValue === null) {
          return -1;
        }

        if (aValue < bValue) {
          return direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const categorySummary = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          const status = getItemStatus(item);
          acc.total += 1;
          if (status === "critical") {
            acc.critical += 1;
          }
          if (status === "critical" || status === "warning") {
            acc.low += 1;
          }
          return acc;
        },
        { total: 0, low: 0, critical: 0 }
      ),
    [items]
  );

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
    const status = getItemStatus(item);
    if (status === "critical") {
      return "bg-red-50/80 hover:bg-red-100 dark:bg-red-900/40 dark:hover:bg-red-900/60";
    }

    if (status === "warning") {
      return "bg-amber-50/80 hover:bg-amber-100 dark:bg-amber-900/30 dark:hover:bg-amber-900/50";
    }

    return `${
      index % 2 === 0
        ? "bg-white/80 dark:bg-slate-900/40"
        : "bg-white/60 dark:bg-slate-900/30"
    } hover:bg-emerald-50/60 dark:hover:bg-emerald-900/30`;
  };

  const healthyCount = Math.max(0, categorySummary.total - categorySummary.low);
  const warningCount = Math.max(0, categorySummary.low - categorySummary.critical);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200/70 bg-white/90 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/30">
      <header className="flex items-start justify-between gap-3 border-b border-slate-200/60 px-6 py-5 dark:border-slate-800">
        <div>
          <button
            type="button"
            onClick={handleCategoryHeaderClick}
            className="text-left"
          >
            <h2 className="text-lg font-semibold text-slate-900 transition hover:text-emerald-600 dark:text-white dark:hover:text-emerald-300">
              {category}
            </h2>
          </button>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {categorySummary.total} items · {healthyCount} healthy · {categorySummary.low} need review
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-500/15 dark:text-red-300">
            {categorySummary.critical} critical
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
            {warningCount} low
          </span>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <div
          className={`overflow-x-auto ${
            sortedItems.length > maxVisibleItems ? "max-h-[320px] overflow-y-auto" : ""
          } scrollbar-thin`}
        >
          <table className="min-w-full divide-y divide-slate-200/70 dark:divide-slate-800">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-300"
                    onClick={() => requestSort("name")}
                  >
                    Item
                    <FaSort />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-300"
                    onClick={() => requestSort("status")}
                  >
                    Status
                    <FaSort />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-300"
                    onClick={() => requestSort("quantity")}
                  >
                    On hand
                    <FaSort />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-300"
                    onClick={() => requestSort("price")}
                  >
                    Price
                    <FaSort />
                  </button>
                </th>
                <th className="px-6 py-3 text-center">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-300"
                    onClick={() => requestSort("last_updated")}
                  >
                    Last updated
                    <FaSort />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 text-sm dark:divide-slate-800">
              {sortedItems.map((item, index) => {
                const status = getItemStatus(item);
                const config = statusConfig[status];
                const progress = getProgressPercentage(item);
                const quantity = Number(item.quantity) || 0;
                const recommended = Number(item.recommended_quantity) || 0;
                const warningLevel = Number(item.warning_quantity) || 0;
                const priceValue = Number(item.price);
                const formattedPrice = Number.isNaN(priceValue)
                  ? item.price
                  : `$${priceValue.toFixed(2)}`;

                const date = new Date(item.last_updated);
                const formattedDate = date.toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr key={item.id} className={`${getRowClassName(item, index)} transition`}> 
                    <td className="px-6 py-4 align-top text-sm">
                      <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {item.category}
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top text-sm">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${config.badgeClass}`}>
                        {status === "healthy" ? (
                          <FiCheckCircle className="h-4 w-4" />
                        ) : (
                          <FiAlertTriangle className="h-4 w-4" />
                        )}
                        {config.label}
                      </span>
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {config.description}
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-slate-900 dark:text-white">
                      <div className="flex flex-col gap-2">
                        <span className="text-base font-semibold">{quantity}</span>
                        {recommended > 0 ? (
                          <>
                            <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                              <div
                                className={`h-full rounded-full ${config.barClass}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              Par {recommended}
                              {warningLevel > 0 ? ` · Alert ${warningLevel}` : ""}
                            </p>
                          </>
                        ) : (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            No par level set
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-medium text-emerald-600 dark:text-emerald-300">
                      {formattedPrice}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-300">
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
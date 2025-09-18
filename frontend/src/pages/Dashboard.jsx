import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlertTriangle,
  FiClipboard,
  FiCoffee,
  FiDroplet,
  FiGrid,
  FiPackage,
  FiTool,
  FiTrendingDown,
} from "react-icons/fi";
import MainLayout from "../components/MainLayout";
import DashboardCard from "../components/DashboardCard";
import SearchBar from "../components/SearchBar";
import SkeletonLoader from "../components/SkeletonLoader";
import API from "../utilities/Axios";

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

const getStockRatio = (item) => {
  const quantity = Number(item.quantity);
  const recommended = Number(item.recommended_quantity);

  if (Number.isNaN(quantity)) {
    return 0;
  }

  if (Number.isNaN(recommended) || recommended <= 0) {
    return quantity > 0 ? 1 : 0;
  }

  return quantity / recommended;
};

const StatCard = ({ label, value, sublabel, icon: Icon, accent, loading }) => (
  <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm shadow-emerald-100/40 dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/20">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
          {loading ? (
            <span className="inline-block h-6 w-14 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          ) : (
            value
          )}
        </p>
        {sublabel && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {loading ? (
              <span className="inline-block h-3 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
            ) : (
              sublabel
            )}
          </p>
        )}
      </div>
      {Icon && (
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${accent}`}>
          <Icon className="h-5 w-5" />
        </span>
      )}
    </div>
  </div>
);

function Dashboard() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState(["All categories"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchInventoryItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await API.get("inventory/items/");
        if (!isMounted) {
          return;
        }

        setInventoryItems(response.data);
        setFilteredItems(response.data);

        const uniqueCategories = Array.from(
          new Set(
            response.data
              .map((item) => item.category || "Uncategorized")
              .filter(Boolean)
          )
        );
        setCategories(["All categories", ...uniqueCategories]);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }
        console.error("Error fetching inventory items:", fetchError);
        setError("We couldn't load the latest inventory. Please try refreshing.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchInventoryItems();

    return () => {
      isMounted = false;
    };
  }, []);

  // Search handler wrapped with useCallback
  const handleSearch = useCallback(
    (searchTerm, category) => {
      const trimmedTerm = searchTerm.trim().toLowerCase();
      const normalizedCategory = category;

      const filtered = inventoryItems.filter((item) => {
        const categoryName = item.category || "Uncategorized";
        const matchesCategory =
          normalizedCategory === "" || categoryName === normalizedCategory;
        const matchesSearch =
          trimmedTerm === "" ||
          item.name.toLowerCase().includes(trimmedTerm) ||
          categoryName.toLowerCase().includes(trimmedTerm);

        return matchesCategory && matchesSearch;
      });

      setFilteredItems(filtered);
    },
    [inventoryItems]
  );

  const itemsByCategory = useMemo(
    () =>
      filteredItems.reduce((acc, item) => {
        const categoryName = item.category || "Uncategorized";
        acc[categoryName] = acc[categoryName] || [];
        acc[categoryName].push(item);
        return acc;
      }, {}),
    [filteredItems]
  );

  const stats = useMemo(() => {
    const lowStockItems = inventoryItems.filter((item) => {
      const status = getItemStatus(item);
      return status === "warning" || status === "critical";
    });

    const criticalItems = inventoryItems.filter(
      (item) => getItemStatus(item) === "critical"
    );

    const outOfStockItems = inventoryItems.filter(
      (item) => Number(item.quantity) <= 0
    );

    const uniqueCategories = new Set(
      inventoryItems.map((item) => item.category || "Uncategorized")
    );

    return {
      totalItems: inventoryItems.length,
      totalCategories: uniqueCategories.size,
      lowStockItems: lowStockItems.length,
      criticalItems: criticalItems.length,
      outOfStockItems: outOfStockItems.length,
    };
  }, [inventoryItems]);

  const lowStockPreview = useMemo(() => {
    const statusPriority = { critical: 0, warning: 1, healthy: 2 };

    return [...inventoryItems]
      .filter((item) => {
        const status = getItemStatus(item);
        return status === "critical" || status === "warning";
      })
      .sort((a, b) => {
        const statusDifference =
          statusPriority[getItemStatus(a)] - statusPriority[getItemStatus(b)];
        if (statusDifference !== 0) {
          return statusDifference;
        }

        const ratioDifference = getStockRatio(a) - getStockRatio(b);
        if (ratioDifference !== 0) {
          return ratioDifference;
        }

        return a.name.localeCompare(b.name);
      })
      .slice(0, 5);
  }, [inventoryItems]);

  const categorySummaries = useMemo(
    () =>
      inventoryItems.reduce((acc, item) => {
        const categoryName = item.category || "Uncategorized";
        if (!acc[categoryName]) {
          acc[categoryName] = { name: categoryName, total: 0, lowStock: 0, critical: 0 };
        }

        const status = getItemStatus(item);
        acc[categoryName].total += 1;
        if (status === "critical") {
          acc[categoryName].critical += 1;
          acc[categoryName].lowStock += 1;
        } else if (status === "warning") {
          acc[categoryName].lowStock += 1;
        }

        return acc;
      }, {}),
    [inventoryItems]
  );

  const sortedCategorySummaries = useMemo(
    () =>
      Object.values(categorySummaries).sort((a, b) => {
        if (b.critical !== a.critical) {
          return b.critical - a.critical;
        }
        if (b.lowStock !== a.lowStock) {
          return b.lowStock - a.lowStock;
        }
        return b.total - a.total;
      }),
    [categorySummaries]
  );

  const departmentInsights = useMemo(() => {
    const availableCategories = categories.filter(
      (category) => category && category !== "All categories"
    );

    const findMatches = (keywords) =>
      availableCategories.filter((category) =>
        keywords.some((keyword) =>
          category.toLowerCase().includes(keyword.toLowerCase())
        )
      );

    const buildInsight = (config, fallbackIndex) => {
      const matches = findMatches(config.keywords);
      let categoriesToUse = matches;
      if (categoriesToUse.length === 0 && sortedCategorySummaries[fallbackIndex]) {
        categoriesToUse = [sortedCategorySummaries[fallbackIndex].name];
      }

      const summary = categoriesToUse.reduce(
        (acc, categoryName) => {
          const categorySummary = categorySummaries[categoryName];
          if (!categorySummary) {
            return acc;
          }

          return {
            total: acc.total + categorySummary.total,
            lowStock: acc.lowStock + categorySummary.lowStock,
            critical: acc.critical + categorySummary.critical,
          };
        },
        { total: 0, lowStock: 0, critical: 0 }
      );

      return {
        ...config,
        categories: categoriesToUse,
        summary,
        navigationCategory: categoriesToUse[0] || null,
        hasDirectMatch: matches.length > 0,
      };
    };

    const configs = [
      {
        id: "front-desk",
        title: "Front Desk · Snack Shelf",
        description:
          "Spot guest favorites that are running low, top up the snack shelf quickly, and keep alert levels dialled in.",
        icon: FiCoffee,
        accent: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
        keywords: ["snack", "pantry", "beverage", "coffee", "front desk", "drink"],
      },
      {
        id: "housekeeping",
        title: "Housekeeping · Supplies",
        description:
          "Monitor cleaning supplies, linens, and deep clean reminders so the next alert never sneaks up on the team.",
        icon: FiDroplet,
        accent: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
        keywords: ["housekeeping", "clean", "linen", "laundry", "amenity", "bathroom"],
      },
      {
        id: "maintenance",
        title: "Maintenance · Preventative",
        description:
          "Track preventative maintenance parts, log PM visits, and schedule the next rounds with plenty of notice.",
        icon: FiTool,
        accent: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300",
        keywords: ["maintenance", "pm", "prevent", "tool", "hardware", "engineering"],
      },
    ];

    return configs.map((config, index) => buildInsight(config, index));
  }, [categories, categorySummaries, sortedCategorySummaries]);

  const handleCategoryClick = useCallback(
    (categoryName) => {
      if (!categoryName) {
        return;
      }
      navigate(`/inventory-management/${encodeURIComponent(categoryName)}`);
    },
    [navigate]
  );

  const formatNumber = (value) => new Intl.NumberFormat().format(value);

  const statCards = useMemo(
    () => [
      {
        key: "total-items",
        label: "Total items",
        value: formatNumber(stats.totalItems),
        sublabel: stats.totalItems === 1 ? "Item tracked" : "Items tracked",
        icon: FiPackage,
        accent: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
      },
      {
        key: "categories",
        label: "Categories",
        value: formatNumber(stats.totalCategories),
        sublabel: stats.totalCategories === 1 ? "Category in use" : "Categories in use",
        icon: FiGrid,
        accent: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
      },
      {
        key: "low-stock",
        label: "Low stock alerts",
        value: formatNumber(stats.lowStockItems),
        sublabel: `${formatNumber(stats.criticalItems)} critical`,
        icon: FiAlertTriangle,
        accent: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
      },
      {
        key: "out-of-stock",
        label: "Out of stock",
        value: formatNumber(stats.outOfStockItems),
        sublabel:
          stats.outOfStockItems === 1 ? "Item to restock" : "Items to restock",
        icon: FiTrendingDown,
        accent: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
      },
    ],
    [stats]
  );

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
          <section className="grid gap-6 lg:grid-cols-[2fr,1.05fr]">
            <div className="relative rounded-4xl border border-white/60 bg-white/85 p-8 shadow-xl shadow-emerald-100/40 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-emerald-900/20">
              <div className="pointer-events-none absolute -left-24 -top-28 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/10" />
              <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/10" />
              <div className="relative z-10 flex h-full flex-col gap-8">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                    <FiClipboard className="h-4 w-4" />
                    Operations hub
                  </span>
                  <h1 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                    Stay ahead of every shelf, cart, and tool
                  </h1>
                  <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                    Manage snack shelf refills, housekeeping supplies, and preventative maintenance from one clear, easy-to-scan dashboard.
                  </p>
                </div>
                <SearchBar
                  categories={categories}
                  onSearch={handleSearch}
                  className="w-full"
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {statCards.map((card) => (
                    <StatCard key={card.key} {...card} loading={isLoading} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-4xl border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Live alerts
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                      Items that need attention
                    </h2>
                  </div>
                  <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
                    {formatNumber(stats.lowStockItems)} alerts
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-16 rounded-3xl border border-slate-200/70 bg-slate-100/80 shadow-sm animate-pulse dark:border-slate-800 dark:bg-slate-800/40"
                      />
                    ))
                  ) : lowStockPreview.length > 0 ? (
                    lowStockPreview.map((item) => {
                      const status = getItemStatus(item);
                      const badgeClass =
                        status === "critical"
                          ? "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-300"
                          : "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300";
                      const warning = Number(item.warning_quantity);
                      const recommended = Number(item.recommended_quantity);
                      const alertLevel =
                        !Number.isNaN(warning) && warning > 0
                          ? warning
                          : !Number.isNaN(recommended) && recommended > 0
                          ? recommended
                          : null;
                      const percentOfPar =
                        !Number.isNaN(recommended) && recommended > 0
                          ? Math.max(0, Math.min(999, Math.round(getStockRatio(item) * 100)))
                          : null;

                      return (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-4 rounded-3xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {item.category} · {alertLevel ? `Alert at ${alertLevel}` : "No alert level set"}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                            >
                              <FiAlertTriangle className="h-4 w-4" />
                              {item.quantity} in stock
                            </span>
                            {percentOfPar !== null && (
                              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                {percentOfPar}% of par level
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-3xl border border-dashed border-slate-300/70 bg-slate-50/70 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                      You're all set! No items are below their recommended levels right now.
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-4xl border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/30">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Quick navigation
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Jump straight into the workflows each department needs most.
                </p>
                <div className="mt-4 space-y-3">
                  {departmentInsights.map((insight) => {
                    const summaryText = insight.summary.total
                      ? `${formatNumber(insight.summary.critical)} critical · ${formatNumber(
                          Math.max(0, insight.summary.lowStock - insight.summary.critical)
                        )} low · ${formatNumber(insight.summary.total)} items`
                      : insight.navigationCategory
                      ? "Review items in this category"
                      : "Assign a category to unlock quick actions";

                    return (
                      <button
                        key={insight.id}
                        type="button"
                        onClick={() =>
                          insight.navigationCategory &&
                          handleCategoryClick(insight.navigationCategory)
                        }
                        className={`group flex w-full items-start justify-between gap-3 rounded-3xl border px-4 py-3 text-left transition ${
                          insight.navigationCategory
                            ? "border-slate-200/70 bg-white/80 hover:border-emerald-400 hover:bg-emerald-50/60 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-emerald-400/60 dark:hover:bg-emerald-900/30"
                            : "cursor-not-allowed border-slate-200/70 bg-slate-50/70 text-slate-400 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-600"
                        }`}
                        disabled={!insight.navigationCategory}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${insight.accent}`}>
                            <insight.icon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {insight.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {insight.description}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                              {summaryText}
                            </p>
                            {insight.categories.length > 0 && (
                              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                                Linked to {insight.categories.slice(0, 2).join(", ")}
                                {insight.categories.length > 2
                                  ? ` +${insight.categories.length - 2} more`
                                  : ""}
                                {!insight.hasDirectMatch && " (auto-selected)"}
                              </p>
                            )}
                          </div>
                        </div>
                        {insight.navigationCategory && (
                          <span className="mt-1 text-xs font-semibold text-emerald-600 opacity-0 transition group-hover:opacity-100 dark:text-emerald-300">
                            View
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-900/30 dark:text-red-200">
              {error}
            </div>
          )}

          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Inventory by category
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Sort items, check par levels, and update counts without leaving the dashboard.
                </p>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Showing {formatNumber(filteredItems.length)} items across {formatNumber(Object.keys(itemsByCategory).length)} categories
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                <SkeletonLoader />
              </div>
            ) : Object.keys(itemsByCategory).length > 0 ? (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
                {Object.keys(itemsByCategory).map((category) => (
                  <DashboardCard
                    key={category}
                    category={category}
                    items={itemsByCategory[category]}
                    onClick={handleCategoryClick}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300/70 bg-white/80 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
                {inventoryItems.length === 0
                  ? "Once inventory is added, it will show up here."
                  : "No items match the current search. Try another keyword or reset the filters."}
              </div>
            )}
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
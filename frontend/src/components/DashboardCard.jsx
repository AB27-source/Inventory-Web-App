import React from "react";

function DashboardCard({ category, items }) {
  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          {category}
        </h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-slate-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2 w-1/4 min-w-[160px]">
                  <div className="font-semibold text-left">Item Name</div>
                </th>
                <th className="p-2 w-1/4 min-w-[120px]">
                  <div className="font-semibold text-center">Quantity</div>
                </th>
                <th className="p-2 w-1/4 min-w-[120px]">
                  <div className="font-semibold text-center">Price</div>
                </th>
                <th className="p-2 w-1/4 min-w-[160px]">
                  <div className="font-semibold text-center">Last Updated</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
              {items.map((item) => {
                const date = new Date(item.last_updated);
                const formattedDate = date.toLocaleDateString(undefined, {
                  day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                });

                return (
                  <tr key={item.id}>
                    <td className="p-2">
                      <div className="text-slate-800 dark:text-slate-100 truncate">
                        {item.name}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-center">{item.quantity}</div>
                    </td>
                    <td className="p-2">
                      <div className="text-center text-emerald-500">
                        ${item.price}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-center">{formattedDate}</div>
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

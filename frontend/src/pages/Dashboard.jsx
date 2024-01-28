import React from "react";
import MainLayout from "../components/MainLayout";
import DashboardCard from "../components/DashboardCard";

function Dashboard() {
  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-slate-200 dark:bg-slate-900 px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
        </div>
        <div className="flex-grow"></div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;

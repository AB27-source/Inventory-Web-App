import React from "react";

const SkeletonLoader = () => {
  return (
    <div role="status" className="w-full h-[300px] flex flex-col space-y-4 animate-pulse">
      {/* Skeleton Table Header */}
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>

      {/* Skeleton Table Rows (5 Placeholder Rows) */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      ))}

      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SkeletonLoader;

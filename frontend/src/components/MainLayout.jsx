import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;

// import React, { useState } from "react";
// import Navbar from "../components/navbar/Navbar";
// import Sidebar from "../components/Sidebar";

// const MainLayout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   return (
//     <div className="flex h-screen overflow-hidden bg-slate-200 dark:bg-slate-900"> {/* Ensure the background color is set here for the full height */}
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//       <div className="flex flex-col flex-1 overflow-y-auto"> {/* Remove overflow-x-hidden if not needed */}
//         <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         {/* Apply padding-top to `main` equals to the height of the Navbar to prevent overlap */}
//         <main className="pt-[4rem] flex-grow"> {/* Adjust pt-[4rem] to match your Navbar's height */}
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;

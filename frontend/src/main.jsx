import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import "./index.css";
import { DarkModeProvider } from './utilities/DarkModeProvider';

// Importing components and pages
import Login from './pages/Login';
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import VerifyEmail from './components/EmailVerification';
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import InventoryManagement from "./pages/InventoryManager";

// Importing utilities
import { AuthProvider } from './utilities/AuthProvider';

// Placeholder components for pages
const Home = () => <div>Home Page</div>;
const About = () => <div>About Page</div>;
const Contact = () => <div>Contact Page</div>;
const NotFound = () => <div>404 - Not Found</div>;

// Custom hook for scrolling to top on route change
function useScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
}

function App() {
  useScrollToTop();

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/inventory-management/:category" element={<PrivateRoute><InventoryManagement /></PrivateRoute>} />
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ResetPassword />} />
      <Route path="signup" element={<Signup />} />
      <Route path="verify-email" element={<VerifyEmail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <DarkModeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DarkModeProvider>
    </AuthProvider>
  </React.StrictMode>
);
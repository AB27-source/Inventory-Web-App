import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './themes';
import "./index.css";
import { DarkModeProvider } from './components/DarkModeProvider';

// Importing components and pages
import MainLayout from './components/MainLayout';
import Root from './pages/Root';
import Login from './pages/Login';
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import VerifyEmail from './components/EmailVerification';

// Placeholder components for pages
const Home = () => <div>Home Page</div>;
const About = () => <div>About Page</div>;
const Contact = () => <div>Contact Page</div>;
const NotFound = () => <div>404 - Not Found</div>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout><Root /></MainLayout>, // Wrap Root with MainLayout
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      // ...other routes
    ],
  },
  { path: 'login', element: <Login /> },
  { path: 'forgot-password', element: <ResetPassword /> },
  { path: 'signup', element: <Signup /> },
  { path: 'verify-email', element: <VerifyEmail /> },
  { path: '*', element: <NotFound /> },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </DarkModeProvider>
  </React.StrictMode>
);

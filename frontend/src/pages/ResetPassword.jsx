import React, { useState } from "react";
import axios from "axios";
import { BsMoon, BsSun } from "react-icons/bs";
import { useDarkMode } from "../components/DarkModeProvider.jsx";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Create a navigate function for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/request-reset-email/",
        { email }
      );
      setMessage(
        "If an account with this email exists, a password reset link has been sent."
      );
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center">
      <div className="w-full max-w-md px-6 py-8 mx-auto">
        <div className="relative w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Forgot Password
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700"
              >
                Send Reset Link
              </button>
            </form>
            {message && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {message}
              </p>
            )}
          </div>
          <div className="flex justify-between items-center p-4 dark:border-gray-600">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-light text-gray-500 dark:text-gray-400"
            >
              Back to Login
            </button>
            <button
              onClick={toggleDarkMode}
              className="text-gray-600 dark:text-gray-300"
            >
              {darkMode === "true" ? (
                <BsSun fontSize={20} />
              ) : (
                <BsMoon fontSize={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;

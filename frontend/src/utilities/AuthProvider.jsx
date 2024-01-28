import { createContext, useContext, useMemo, useState } from "react";
import useLocalStorage from "./useLocalStorage";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null);
  const [username, setUsername] = useLocalStorage('username', null);
  const [email, setEmail] = useLocalStorage('email', null);

  const authProviderLogin = async (emailInput, password) => {
    try {
      const loginUrl = "http://localhost:8000/api/v1/auth/login/";
      const response = await axios.post(loginUrl, { email: emailInput, password });
      const fullName = `${response.data.first_name} ${response.data.last_name}`;

      setUser(response.data.tokens.refresh); // Persist token to local storage
      setUsername(fullName); // Persist username to local storage
      setEmail(response.data.email);

      console.log("Login successful:", response.data);
      return true; // Indicate success
    } catch (error) {
      console.error("Login error:", error);
      return error.response?.data?.detail || "Login failed"; // Return specific error message
    }
  };

  const authProviderLogout = () => {
    setUser(null);
    setUsername(null);
    setEmail(null);
    console.log("Logout successful");
  };

  const value = useMemo(
    () => ({
      user,
      username,
      email,
      authProviderLogin,
      authProviderLogout,
    }),
    [user, username, email]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
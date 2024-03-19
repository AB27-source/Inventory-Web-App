import { createContext, useContext, useMemo, useState } from "react";
import useLocalStorage from "./useLocalStorage";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useLocalStorage('tokens', null);
  const [user, setUser] = useLocalStorage('user', null);
  const [username, setUsername] = useLocalStorage('username', null);
  const [email, setEmail] = useLocalStorage('email', null);
  const [role, setRole] = useLocalStorage('role', null);

  const authProviderLogin = async (emailInput, password) => {
    try {
      const loginUrl = "http://localhost:8000/api/v1/auth/login/";
      const response = await axios.post(loginUrl, { email: emailInput, password });
      const fullName = `${response.data.first_name} ${response.data.last_name}`;
      const userRole = response.data.role;

      setTokens(response.data.tokens);
      setUser(response.data.tokens.refresh); // Persist token to local storage
      setUsername(fullName); // Persist username to local storage
      setEmail(response.data.email);
      setRole(userRole);

      console.log("Login successful:", response.data);
      return true; // Indicate success
    } catch (error) {
      console.error("Login error:", error);
      return error.response?.data?.detail || "Login failed";
    }
  };

  const authProviderLogout = () => {
    setTokens(null);
    setUser(null);
    setUsername(null);
    setEmail(null);
    setRole(null); // Clear user role from local storage
    console.log("Logout successful");
  };

  const value = useMemo(
    () => ({
      tokens,
      user,
      username,
      email,
      role,
      authProviderLogin,
      authProviderLogout,
    }),
    [tokens, user, username, email]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
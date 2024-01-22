import { createContext, useContext, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";
import axios from "axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("token", null);
  const [username, setUsername] = useLocalStorage("username", null);
  const [email, setEmail] = useLocalStorage("email", null);

  const authProviderLogin = async (email, password) => {
    try {
      const loginUrl = "http://localhost:8000/api/v1/auth/login/";
      const response = await axios.post(loginUrl, { email, password });
      const fullName = `${response.data.first_name} ${response.data.last_name}`;

      setUser(response.data.tokens.refresh);
      setUsername(fullName);
      setEmail(response.data.email);

      console.log("Login successful:", response.data); // Success message

    } catch (error) {
      console.error("Login error:", error); // Error message
    }
  };

  const authProviderLogout = () => {
    setUser(null);
    setUsername(null);
    setEmail(null);

    console.log("Logout successful"); // Success message for logout
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

export const useAuth = () => {
  return useContext(AuthContext);
};

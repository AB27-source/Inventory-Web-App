import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

export const DarkContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return window.localStorage.getItem("DARK_MODE") || "false";
  });

  useEffect(() => {
    document.documentElement.className = darkMode === "true" ? "dark" : "";
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = darkMode === "true" ? "false" : "true";
    window.localStorage.setItem("DARK_MODE", newMode);
    setDarkMode(newMode);
  };

  const value = useMemo(() => ({ darkMode, toggleDarkMode }), [darkMode]);

  return (
    <DarkContext.Provider value={value}>
      {children}
    </DarkContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkContext);

import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkContext = createContext({
  currentTheme: 'light',
  changeCurrentTheme: () => {},
});

export const DarkModeProvider = ({ children }) => {

  const persistedTheme = localStorage.getItem('theme') || 'light';
  const [theme, setTheme] = useState(persistedTheme);

  const changeCurrentTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {

    document.documentElement.classList.add('[&_*]:!transition-none');

    document.documentElement.className = theme === 'dark' ? 'dark' : '';

    const transitionTimeout = setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none');
    }, 1);

    return () => clearTimeout(transitionTimeout);
  }, [theme]);

  return (
    <DarkContext.Provider value={{ currentTheme: theme, changeCurrentTheme }}>
      {children}
    </DarkContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkContext);

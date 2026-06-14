import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";

type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Read initial theme from <html> class set by _document.tsx script
    const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(currentTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    // Set body bg & text color dynamically (warm palette to match the git-flow timeline)
    if (theme === "dark") {
      document.body.style.backgroundColor = "#0f0e0c";
      document.body.style.color = "#f0ede4";
    } else {
      document.body.style.backgroundColor = "#FAFAF7";
      document.body.style.color = "#1A1A1A";
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

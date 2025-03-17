import { useState, useEffect } from "react";
import { createContext, FC, ReactNode, useContext } from "react";

type ThemeI = {
  [key: string]: any;
};
interface ThemeContextValue {
  theme: ThemeI;
}

const initialTheme: ThemeI = {
  // primaryColor: "#FF244C",
  // secondaryColor: "#00ff00",
};

export const ThemeContext = createContext<ThemeContextValue>({
  theme: initialTheme,
});
function createCssVariables(
  theme: ThemeI,
  prefix = ""
): Record<string, string> {
  return Object.entries(theme).reduce((acc, [key, value]) => {
    const variableName = prefix ? `${prefix}-${key}` : key;

    if (typeof value === "object") {
      const nestedVariables = createCssVariables(value, variableName);
      Object.assign(acc, nestedVariables);
    } else {
      acc[variableName] = value as string;
    }

    return acc;
  }, {} as Record<string, string>);
}
export const ThemeProvider: FC<{ theme: ThemeI; children: ReactNode }> = ({
  theme,
  children,
}) => {
  const [currentTheme, setTheme] = useState(theme);

  useEffect(() => {
    const cssVariables = createCssVariables(currentTheme);
    const root = document.documentElement;

    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

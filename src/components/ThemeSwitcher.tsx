import { createContext, useContext, useEffect, useState } from "react";
import * as echarts from "echarts";
import { InputSwitch } from "primereact/inputswitch";
import echartsDarkTheme from "../themes/dark.json";
import echartsLightTheme from "../themes/light.json";

const validThemes = ["dark", "light"];
const defaultTheme = "light";
const themeLsKey = "theme";

type ThemeState = [string, (theme: string) => void];

echarts.registerTheme("dark", echartsDarkTheme);
echarts.registerTheme("light", echartsLightTheme);

function setThemeToLs(theme: string) {
  localStorage.setItem(themeLsKey, theme);
}

function getThemeFromLs(): string {
  const lsTheme = localStorage.getItem(themeLsKey) ?? defaultTheme;
  if (!validThemes.includes(lsTheme)) {
    console.error(
      "invalid theme in localStorage: '%s', falling back to light",
      lsTheme
    );
    setThemeToLs(defaultTheme);
    return defaultTheme;
  }
  return lsTheme;
}

export const ThemeContext = createContext<ThemeState | undefined>(undefined);

function useTheme(): ThemeState {
  const [theme, setTheme] = useState(getThemeFromLs());
  const themedElement = document.documentElement;
  useEffect(() => {
    themedElement.classList.add(theme);
  });
  return [
    theme,
    (newTheme) => {
      setThemeToLs(newTheme);
      themedElement.classList.replace(theme, newTheme);
      setTheme(newTheme);
    },
  ];
}

type ThemeProviderProps = {
  children: string | JSX.Element | JSX.Element[];
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useTheme();
  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeSwitcher(): JSX.Element {
  const themeContext = useContext(ThemeContext);
  if (themeContext === undefined) {
    throw new Error("ThemeSwitcher used outside ThemeProvider");
  }
  const [theme, setTheme] = themeContext;
  return (
    <div className="flex align-items-center">
      <i className="pi pi-sun text-2xl" />
      <InputSwitch
        className="mx-2"
        checked={theme === "dark"}
        onChange={(e) => {
          setTheme(e.value ? "dark" : "light");
        }}
      />
      <i className="pi pi-moon text-2xl" />
    </div>
  );
}

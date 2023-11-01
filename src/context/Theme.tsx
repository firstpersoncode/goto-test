import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import { isDarkMode } from "@/libs/utils";

/** =================================== TYPES =================================== */

interface ThemeContext {
  isClient: boolean;
  colorMode: "light" | "dark";
  viewMode: "stream" | "column";
  isMobile: boolean;
  toggleColorMode: () => void;
  toggleViewMode: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

/** =================================== PROVIDER =================================== */

const initialContext: ThemeContext = {
  isClient: false,
  colorMode: "light",
  viewMode: "stream",
  isMobile: false,
  toggleColorMode: () => {},
  toggleViewMode: () => {},
};

const Theme = createContext<ThemeContext>(initialContext);

export const useTheme = () => useContext(Theme);

export default function ThemeProvider({ children }: ThemeProviderProps) {
  {
    /** =================================== STATES =================================== */
  }
  const [isClient, setIsClient] = useState(initialContext.isClient);
  const [colorMode, setColorMode] = useState(initialContext.colorMode);
  const [viewMode, setViewMode] = useState(initialContext.viewMode);

  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  {
    /** =================================== DISPATCHERS =================================== */
  }

  const toggleColorMode = () => {
    setColorMode((v) => {
      const currColorMode = v === "light" ? "dark" : "light";
      localStorage.setItem("colorMode", currColorMode);
      return currColorMode;
    });
  };

  const toggleViewMode = () =>
    setViewMode((v) => (v === "stream" ? "column" : "stream"));

  {
    /** =================================== EFFECTS =================================== */
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedColorMode = localStorage.getItem("colorMode");
      if (savedColorMode) setColorMode(savedColorMode as "light" | "dark");
      else if (isDarkMode()) setColorMode("dark");
    }
  }, [isClient]);

  return (
    <MuiThemeProvider theme={createTheme({ palette: { mode: colorMode } })}>
      <Theme.Provider
        value={{
          isClient,
          colorMode,
          viewMode,
          isMobile,
          toggleColorMode,
          toggleViewMode,
        }}
      >
        {children}
      </Theme.Provider>
    </MuiThemeProvider>
  );
}

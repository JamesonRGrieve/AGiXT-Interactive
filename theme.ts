declare module "@mui/material/styles" {
  interface Theme {
    mutate: () => void;
  }
  interface ThemeOptions {
    mutate?: () => void;
  }
  interface Palette {
    colorblind: boolean;
  }
  interface PaletteOptions {
    colorblind?: boolean;
  }
}
import { createTheme } from "@mui/material";
export default function buildTheme(dark: boolean, colorblind: boolean) {
  return createTheme({
    palette: {
      colorblind: colorblind,
      mode: dark ? "dark" : "light",
      primary: {
        main: colorblind ? (dark ? "#FFF" : "#000") : "#273043",
      },
      secondary: {
        main: colorblind ? (dark ? "#FFF" : "#000") : "#9c27b0",
      },
      error: {
        main: colorblind ? (dark ? "#FFF" : "#000") : "#d32f2f",
      },
      warning: {
        main: colorblind ? (dark ? "#FFF" : "#000") : "#ed6c02",
      },
      info: {
        main: colorblind ? (dark ? "#FFF" : "#000") : "#0288d1",
      },
      success: {
        main: colorblind ? (dark ? "#FFF" : "#000") : "#2e7d32",
      },
    },
    typography: {
      fontFamily: "Ubuntu Mono, sans-serif",
    },
  });
}

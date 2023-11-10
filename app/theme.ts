"use client";
import { createTheme } from '@mui/material';
import { deepmerge } from '@mui/utils';
import { Themes }from 'jrgcomponents/types/Theming';
const defaultTheme = createTheme();
// Ensure any partial overrides are spread into this if you intend to reference them in custom themes.
const palette = {
  ...defaultTheme.palette,
  colorblind: false,
  primary: {
    light: '#F00',
    main: '#C00',
    dark: '#900'
  },
  secondary: {
    light: '#0F0',
    main: '#0C0',
    dark: '#090'
  },
  text: {
    ...defaultTheme.palette.text,
    primary: '#000'
  },
  background: {
    ...defaultTheme.palette.background,
    default: '#FFF'
  }
}
const baseTheme = {
  //Components
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          fontSize: '14px',
          fontFamily: 'Encode Sans Semi Expanded, Arial, sans-serif',
          textTransform: 'capitalize' as const,

        }
      }
    }
  },
  palette: {
    ...palette
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: {
      fontFamily: 'serif',
      fontSize: '1rem',
      fontWeight: 'bold',
      '@media (min-width:600px)': {
        fontSize: '1.5rem'
      },
    },
    body1: {
      fontSize: '0.75rem',
    },
    button: {
      fontWeight: 'bold',
      fontSize: '14px',
    }
  }
};
const darkOverrides = {
  palette:
  {
    mode: 'dark'
  }
}
const colorblindOverrides = {
  palette: {
    colorblind: true,
    primary: {
      light: '#CCC',
      main: '#999',
      dark: '#333'
    },
    secondary: {
      light: '#CCC',
      main: '#999',
      dark: '#333'
    },
  },
}
export const themeLight = createTheme(baseTheme);
export const themeDark = createTheme(deepmerge(baseTheme, darkOverrides));
export const themeLightColorblind = createTheme(deepmerge(baseTheme, colorblindOverrides));
export const themeDarkColorblind = createTheme(deepmerge(deepmerge(baseTheme, colorblindOverrides), darkOverrides));
const themes = {
  light: themeLight,
  dark: themeDark,
  lightColorblind: themeLightColorblind,
  darkColorblind: themeDarkColorblind
} as Themes;
export default themes;
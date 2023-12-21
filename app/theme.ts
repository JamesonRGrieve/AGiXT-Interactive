'use client';
import { createTheme } from '@mui/material';
import { deepmerge } from '@mui/utils';
import { Themes } from 'jrgcomponents/types/Theming';
const baseTheme = {
  //Components
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          fontSize: '14px',
          fontFamily: 'Encode Sans Semi Expanded, Arial, sans-serif',
          textTransform: 'capitalize' as const
        }
      }
    }
  },
  // Anything that you override from here https://mui.com/material-ui/customization/dark-mode/ needs to also be overridden in dark or it won't be applied.
  palette: {
    colorblind: false,
    primary: {
      light: '#CCCAE3',
      main: '#544D93',
      dark: '#453F78'
    },
    secondary: {
      light: '#F07F9D',
      main: '#E01A4F',
      dark: '#B71540'
    },
    error: {
      light: '#F6998D',
      main: '#F15946',
      dark: '#E42A11'
    },
    info: {
      light: '#91CFDE',
      main: '#53B3CB',
      dark: '#1C515E'
    },
    warning: {
      light: '#FBD774',
      main: '#F9C22E',
      dark: '#EDB007'
    },
    success: {
      light: '#8CB87A',
      main: '#62924F',
      dark: '#436436'
    }
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: {
      fontSize: '1rem',
      fontWeight: 'bold',
      '@media (min-width:600px)': {
        fontSize: '1.5rem'
      }
    },
    body1: {
      fontSize: '0.75rem'
    },
    button: {
      fontWeight: 'bold',
      fontSize: '14px'
    }
  }
};
const darkOverrides = {
  palette: {
    mode: 'dark'
  }
};
const colorblindPalette = {
  light: '#CCC',
  main: '#999',
  dark: '#333'
};
const colorblindOverrides = {
  palette: {
    colorblind: true,
    primary: {
      ...colorblindPalette
    },
    secondary: {
      ...colorblindPalette
    },
    error: {
      ...colorblindPalette
    },
    success: {
      ...colorblindPalette
    },
    info: {
      ...colorblindPalette
    }
  }
};
export const themeLight = createTheme(baseTheme);
export const themeDark = createTheme(deepmerge(baseTheme, darkOverrides));
export const themeLightColorblind = createTheme(deepmerge(baseTheme, colorblindOverrides));
export const themeDarkColorblind = createTheme(deepmerge(deepmerge(baseTheme, darkOverrides), colorblindOverrides));
const themes = {
  light: themeLight,
  dark: themeDark,
  lightColorblind: themeLightColorblind,
  darkColorblind: themeDarkColorblind
} as Themes;
export default themes;

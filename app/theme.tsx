'use client';
import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { deepmerge } from '@mui/utils';
import { ThemeState, ThemeContext } from '@/types/ThemeState';
declare module '@mui/material/styles' {
  interface Palette {
    colorblind: boolean;
  }
  interface PaletteOptions {
    colorblind?: boolean;
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
      primary: '#000'
    },
    background: {
      default: '#FFF'
    }
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
export function ThemeWrapper({children, defaultDark=false, defaultColorblind=false} : {children: any, defaultDark?: boolean , defaultColorblind?: boolean}) {
  const [themeState, setThemeState] = useState<ThemeState>({
    dark: defaultDark,
    colorblind: defaultColorblind,
    mutate: null
  });

  useEffect(() => {
    console.log("Theme State Changed", themeState);
  }, [themeState])
  return (
    <ThemeContext.Provider value={{ ...themeState, mutate: setThemeState }}>
      <ThemeProvider theme={ 
        !themeState.dark?
          (!themeState.colorblind?themeLight:themeLightColorblind):
          (!themeState.colorblind?themeDark:themeDarkColorblind)
        }>
        <CssBaseline />
        {children}
      </ThemeProvider>
      </ThemeContext.Provider>
  );
}
export default ThemeWrapper;
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
const themeConfig = {
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

const themeLight = createTheme(themeConfig);
export default themeLight;
export const themeDark = createTheme(deepmerge(themeConfig, {
  palette:
  {
    mode: 'dark'
  }
}));

export function ThemeRegistry({children} : {children: any}) {
  const [themeState, setThemeState] = useState<ThemeState>({
    dark: false,
    colorblind: false,
    mutate: null
  });

  useEffect(() => {
    console.log("Theme State Changed", themeState);
  }, [themeState])
  return (
    <ThemeContext.Provider value={{ ...themeState, mutate: setThemeState }}>
      <ThemeProvider theme={ 
        !themeState.dark?
          (!themeState.colorblind?themeLight:themeLight):
          (!themeState.colorblind?themeDark:themeDark)
        }>
        <CssBaseline />
        {children}
      </ThemeProvider>
      </ThemeContext.Provider>
  );
}

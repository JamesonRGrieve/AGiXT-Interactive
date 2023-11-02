'use client';
import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { deepmerge } from '@mui/utils';
import { ThemeState, ThemeContext } from '@/types/ThemeState';
import { getCookie, setCookie } from 'cookies-next';
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
export function ThemeWrapper({ children, defaultDark = false, defaultColorblind = false }: { children: any, defaultDark?: boolean, defaultColorblind?: boolean }) {
  /*
  const darkCookie = getCookie("dark", {domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN});
  const colorblindCookie = getCookie("colorblind", { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN });
  console.log(`Retrieved Cookies: dark=${darkCookie}, colorblind=${colorblindCookie}`);
  console.log(darkCookie==="true");
  console.log(colorblindCookie==="true");
  */
  const [themeState, setThemeState] = useState<ThemeState>({
    dark: defaultDark,
    colorblind: defaultColorblind,
    mutate: null
  });
  /*
  useEffect(() => {
    console.log("Loaded");
    const newDark = getCookie("dark", {
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN
    });
    const newColorblind = getCookie("colorblind", {
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN
    });
    if (newDark !== undefined) setThemeState(old => {
      return {
        ...old,
        dark: newDark === "true"
      }
    });
    if (newColorblind !== undefined) setThemeState(old => {
      return {
        ...old,
        colorblind: newColorblind === "true"
      }
    })

  }, [defaultDark, defaultColorblind]);
  */
  useEffect(() => {
    console.log("Theme State Changed", themeState);
    setCookie("dark", themeState.dark, {
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    });
    setCookie("colorblind", themeState.colorblind, {
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    });
    console.log(`Updated Cookies: dark=${getCookie("dark", {
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN
    })}, colorblind=${getCookie("colorblind", { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN })}`);
  }, [themeState])
  console.log("Using ThemeState", themeState);
  return (
    <ThemeContext.Provider value={{ ...themeState, mutate: setThemeState }}>
      <ThemeProvider theme={
        !themeState.dark ?
          (!themeState.colorblind ? themeLight : themeLightColorblind) :
          (!themeState.colorblind ? themeDark : themeDarkColorblind)
      }>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
export default ThemeWrapper;
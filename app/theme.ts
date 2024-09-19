'use client';

const theme = {
  // Anything that you override from here https://mui.com/material-ui/customization/dark-mode/ needs to also be overridden in dark or it won't be applied.
  palette: {
    colorblind: false,
    primary: {
      light: '#CCCAE3',
      main: '#544D93',
      dark: '#453F78',
    },
    secondary: {
      light: '#F07F9D',
      main: '#E01A4F',
      dark: '#B71540',
    },
    error: {
      light: '#F6998D',
      main: '#F15946',
      dark: '#E42A11',
    },
    info: {
      light: '#91CFDE',
      main: '#53B3CB',
      dark: '#1C515E',
    },
    warning: {
      light: '#FBD774',
      main: '#F9C22E',
      dark: '#EDB007',
    },
    success: {
      light: '#8CB87A',
      main: '#62924F',
      dark: '#436436',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      '@media (min-width:600px)': {
        fontSize: '1.8rem',
      },
    },
    h3: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      '@media (min-width:600px)': {
        fontSize: '1.3rem',
      },
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      '@media (min-width:600px)': {
        fontSize: '1.2rem',
      },
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 'bold',
      '@media (min-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      fontWeight: 'bold',
      fontSize: '14px',
    },
  },
};
export default theme;

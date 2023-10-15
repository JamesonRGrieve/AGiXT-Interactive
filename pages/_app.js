import "../styles/globals.css";
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { setCookie, getCookie } from "cookies-next";
import { Box, CssBaseline } from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { MenuDarkSwitch } from "../components/menu/MenuDarkSwitch";
import PropTypes from "prop-types";
import Head from "next/head";

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  flexGrow: 1,

  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
  backgroundColor: theme.palette.primary.main,
  color: "white",
}));
export default function App({ Component, pageProps, dark }) {
  const [darkMode, setDarkMode] = useState(dark);
  const [pageTitle, setPageTitle] = useState("Home");
  const router = useRouter();
  const pageName = router.pathname.split("/")[1];

  const themeGenerator = (darkMode) =>
    createTheme({
      palette: {
        mode: darkMode ? "dark" : "light",
        primary: {
          main: darkMode ? "#000000" : "#273043",
        },
      },
    });
  const theme = themeGenerator(darkMode);

  const handleToggleDarkMode = useCallback(() => {
    setDarkMode((oldVal) => {
      const newVal = !oldVal;
      setCookie("dark", newVal.toString());
      return newVal;
    });
  }, []);

  return (
    <>
      <Head>
        <title>{pageName ? "AGiXT - " + pageTitle : "AGiXT"}</title>
        <meta name="description" content="AGiXT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MenuDarkSwitch checked={darkMode} onChange={handleToggleDarkMode} />
        <Box
          sx={{
            display: "flex",
            marginTop: "-99px",
            marginRight: "1px",
            marginLeft: "1px",
          }}
        >
          <Main sx={{ padding: "0", maxWidth: "100%" }}>
            <DrawerHeader />
            <Component
              {...pageProps}
              theme={theme}
              setPageTitle={setPageTitle}
            />
          </Main>
        </Box>
      </ThemeProvider>
    </>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
  dark: PropTypes.bool.isRequired,
};

App.getInitialProps = async ({ ctx }) => {
  let dark = getCookie("dark", ctx);
  dark === "true"
    ? (dark = true)
    : dark === "false"
    ? (dark = false)
    : (dark = false);
  return {
    dark: dark,
    pageProps: {},
  };
};

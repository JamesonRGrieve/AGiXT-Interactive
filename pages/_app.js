import "../styles/globals.css";
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { setCookie, getCookie } from "cookies-next";
import Link from "next/link";
import { SettingsProvider } from "../lib/SettingsContext";
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import TuneIcon from "@mui/icons-material/Tune";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { ChevronLeft, ChevronRight, Menu } from "@mui/icons-material";
import MenuAgentList from "../components/systems/agent/AgentList";
import AdvancedOptions from "../components/systems/agent/AdvancedOptions";
import TrainOptions from "../components/systems/train/TrainOptions";
import AgentCommandList from "../components/systems/agent/AgentCommandList";
import { MenuDarkSwitch } from "../components/menu/MenuDarkSwitch";
import useSWR from "swr";
import { sdk } from "../lib/apiClient";

const drawerWidth = 200;
const rightDrawerWidth = 310;
const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "rightDrawerOpen",
})(({ theme, open, rightDrawerOpen }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: open ? 0 : `-${drawerWidth}px`, // Adjust based on left drawer
  marginRight: rightDrawerOpen ? `${rightDrawerWidth}px` : 0, // Adjust based on right drawer
}));
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
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
  const [open, setOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(dark);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [collectionNumber, setCollectionNumber] = useState(0);
  const [limit, setLimit] = useState(10);
  const [minRelevanceScore, setMinRelevanceScore] = useState(0.0);
  const [contextResults, setContextResults] = useState(5);
  const [shots, setShots] = useState(1);
  const [browseLinks, setBrowseLinks] = useState(false);
  const [websearch, setWebsearch] = useState(false);
  const [websearchDepth, setWebsearchDepth] = useState(0);
  const [enableMemory, setEnableMemory] = useState(false);
  const [
    injectMemoriesFromCollectionNumber,
    setInjectMemoriesFromCollectionNumber,
  ] = useState(0);
  const [conversationResults, setConversationResults] = useState(5);
  const router = useRouter();
  const pageName = router.pathname.split("/")[1];
  const agentName = router.query.agent;
  const commands = useSWR(
    `agent/${agentName}/commands`,
    async () => await sdk.getCommands(agentName)
  );

  if (darkMode === 'false') {
    setDarkMode(false)
  } else if (darkMode === 'true') {
    setDarkMode(true)
  }

  const themeGenerator = (darkMode) =>
    createTheme({
      palette: {
        mode: darkMode ? "dark" : "light",
        primary: {
          main: "#273043",
        },
      },
    });
  const theme = themeGenerator(darkMode);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleRightDrawerOpen = () => {
    setRightDrawerOpen(true);
  };
  const handleRightDrawerClose = () => {
    setRightDrawerOpen(false);
  };

  const handleToggleDarkMode = useCallback(() => {
    setDarkMode((oldVal) => {
      const newVal = !oldVal;
      setCookie("dark", newVal.toString());
      return newVal;
    });
  }, []);
  if (pageName == "agent") {
  }
  const agents = useSWR("agent", async () => sdk.getAgents());

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "left" }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: "none" }) }}
              >
                <Menu />
              </IconButton>
              <Typography variant="h6" component="h1" noWrap>
                <Link href="/">AGiXT</Link>
              </Typography>
            </Box>

            <MenuDarkSwitch
              checked={darkMode}
              onChange={handleToggleDarkMode}
            />
            <IconButton color="inherit" onClick={handleRightDrawerOpen}>
              <TuneIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader sx={{ justifyContent: "space-between", pl: "1rem" }}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeft fontSize="large" sx={{ color: "white" }} />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <MenuAgentList data={agents.data ? agents.data : []} />
        </Drawer>
        <Drawer
          sx={{
            width: 0,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: rightDrawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="right"
          open={rightDrawerOpen}
        >
          <DrawerHeader>
            <IconButton onClick={handleRightDrawerClose}>
              <Typography noWrap color="white">
                {pageName == "agent" ? "Advanced Options" : null}
                {pageName == "train" ? "Advanced Options" : null}
                {pageName == "settings" ? "Agent Commands" : null}
              </Typography>
              <ChevronRight fontSize="large" sx={{ color: "white" }} />
            </IconButton>
          </DrawerHeader>
          <Divider />
          {pageName === "agent" ? (
            <AdvancedOptions
              contextResults={contextResults}
              setContextResults={setContextResults}
              shots={shots}
              setShots={setShots}
              websearchDepth={websearchDepth}
              setWebsearchDepth={setWebsearchDepth}
              injectMemoriesFromCollectionNumber={
                injectMemoriesFromCollectionNumber
              }
              setInjectMemoriesFromCollectionNumber={
                setInjectMemoriesFromCollectionNumber
              }
              conversationResults={conversationResults}
              setConversationResults={setConversationResults}
              browseLinks={browseLinks}
              setBrowseLinks={setBrowseLinks}
              websearch={websearch}
              setWebsearch={setWebsearch}
              enableMemory={enableMemory}
              setEnableMemory={setEnableMemory}
            />
          ) : null}
          {pageName === "train" ? (
            <TrainOptions
              collectionNumber={collectionNumber}
              limit={limit}
              minRelevanceScore={minRelevanceScore}
              setCollectionNumber={setCollectionNumber}
              setLimit={setLimit}
              setMinRelevanceScore={setMinRelevanceScore}
            />
          ) : null}
          {pageName === "settings" ? (
            commands.isLoading ? (
              "Loading..."
            ) : commands.error ? (
              commands.error.message
            ) : (
              <AgentCommandList data={commands ? commands.data : null} />
            )
          ) : null}
        </Drawer>

        <Main
          open={open}
          rightDrawerOpen={rightDrawerOpen}
          sx={{ padding: "0" }}
        >
          <DrawerHeader />
          <SettingsProvider>
            <Component
              {...pageProps}
              contextResults={contextResults}
              shots={shots}
              browseLinks={browseLinks}
              websearch={websearch}
              websearchDepth={websearchDepth}
              enableMemory={enableMemory}
              injectMemoriesFromCollectionNumber={
                injectMemoriesFromCollectionNumber
              }
              collectionNumber={collectionNumber}
              limit={limit}
              minRelevanceScore={minRelevanceScore}
              conversationResults={conversationResults}
            />
          </SettingsProvider>
        </Main>
      </Box>
    </ThemeProvider>
  );
}
App.getInitialProps = async ({ ctx }) => {
  const dark = getCookie("dark", ctx);
  return { dark: dark };
};

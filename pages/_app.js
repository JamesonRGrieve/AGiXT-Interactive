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
import ChainArgsEditor from "../components/systems/chain/ChainArgsEditor";
import { MenuDarkSwitch } from "../components/menu/MenuDarkSwitch";
import Container from "@mui/material/Container";
import useSWR from "swr";
import { sdk } from "../lib/apiClient";
import PropTypes from "prop-types";
import Head from "next/head";
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
  const [selectedChain, setSelectedChain] = useState("Smart Chat");
  const [
    injectMemoriesFromCollectionNumber,
    setInjectMemoriesFromCollectionNumber,
  ] = useState(0);
  const [conversationResults, setConversationResults] = useState(5);
  const [chainArgs, setChainArgs] = useState({});
  const [singleStep, setSingleStep] = useState(false);
  const [fromStep, setFromStep] = useState(0);
  const [allResponses, setAllResponses] = useState(false);
  const [useSelectedAgent, setUseSelectedAgent] = useState(true);

  const handleArgsChange = (args) => {
    setChainArgs(args);
  };

  const router = useRouter();
  const pageName = router.pathname.split("/")[1];
  const agentName = router.query.agent;
  const tab = router.query.tab;
  const commands = useSWR(
    `agent/${agentName}/commands`,
    async () => await sdk.getCommands(agentName)
  );

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
  const handleChainChange = (event) => {
    setSelectedChain(event.target.value);
  };
  return (
    <>
      <Head>
        <title>
          AGiXT -&nbsp;{pageName == "chain" ? "Chain Management" : null}
          {pageName == "agent" && tab == 0 ? "Chat" : null}
          {pageName == "agent" && tab == 1 ? "Prompt" : null}
          {pageName == "agent" && tab == 2 ? "Instruct" : null}
          {pageName == "agent" && tab == 3 ? "Chain Execution" : null}
          {pageName == "prompt" ? "Prompt Management" : null}
          {pageName == "train" ? "Agent Training" : null}
          {pageName == "settings" ? "Agent Settings" : null}
        </title>
        <meta name="description" content="AGiXT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <MenuDarkSwitch
                  checked={darkMode}
                  onChange={handleToggleDarkMode}
                />
                {pageName != "prompt" &&
                pageName != "chain" &&
                pageName != "new" ? (
                  <IconButton color="inherit" onClick={handleRightDrawerOpen}>
                    <TuneIcon />
                  </IconButton>
                ) : null}
              </Box>
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
                  {pageName == "agent" && tab != 3 ? "Advanced Options" : null}
                  {pageName == "train" ? "Advanced Options" : null}
                  {pageName == "settings" ? "Agent Commands" : null}
                  {pageName == "agent" && tab == 3 ? "Chain Options" : null}
                </Typography>
                <ChevronRight fontSize="large" sx={{ color: "white" }} />
              </IconButton>
            </DrawerHeader>
            <Divider />
            {pageName === "agent" && tab != 3 ? (
              <Container>
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
                <Typography variant="h6" component="h1" noWrap>
                  Agent Commands
                </Typography>
                <Divider />
              </Container>
            ) : null}

            {pageName === "agent" && tab == 3 ? (
              <>
                <ChainArgsEditor
                  selectedChain={selectedChain}
                  sdk={sdk}
                  chainArgs={chainArgs}
                  setChainArgs={setChainArgs}
                  onChange={handleArgsChange}
                  singleStep={singleStep}
                  setSingleStep={setSingleStep}
                  fromStep={fromStep}
                  setFromStep={setFromStep}
                  allResponses={allResponses}
                  setAllResponses={setAllResponses}
                  useSelectedAgent={useSelectedAgent}
                  setUseSelectedAgent={setUseSelectedAgent}
                />
                {/*
              singleStep checkbox, false by default.
              fromStep - Number to start step from, default 0.  If singleStep is checked, this is the step to run.
              allResponses - Boolean, default false.  
                If true, it will output all responses in the last response instead of just the last one.
               */}
              </>
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
            {pageName === "settings" || pageName === "agent" ? (
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
              {commands.isLoading ? (
                "Loading..."
              ) : commands.error ? (
                commands.error.message
              ) : (
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
                  selectedChain={selectedChain}
                  setSelectedChain={setSelectedChain}
                  chainArgs={chainArgs}
                  setChainArgs={setChainArgs}
                  handleChainChange={handleChainChange}
                  singleStep={singleStep}
                  setSingleStep={setSingleStep}
                  fromStep={fromStep}
                  setFromStep={setFromStep}
                  allResponses={allResponses}
                  setAllResponses={setAllResponses}
                  useSelectedAgent={useSelectedAgent}
                  setUseSelectedAgent={setUseSelectedAgent}
                  drawerWidth={drawerWidth}
                  rightDrawerWidth={rightDrawerWidth}
                  commands={commands.data}
                />
              )}
            </SettingsProvider>
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

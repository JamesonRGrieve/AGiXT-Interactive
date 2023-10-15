import "../styles/globals.css";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { setCookie, getCookie } from "cookies-next";
import { Box, CssBaseline, Toolbar, Divider } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { Menu } from "@mui/icons-material";
import { MenuDarkSwitch } from "../components/menu/MenuDarkSwitch";
import useSWR from "swr";
import { sdk } from "../lib/apiClient";
import PropTypes from "prop-types";
import Head from "next/head";
const drawerWidth = 4;
const rightDrawerWidth = 0;
const bothDrawersWidth = drawerWidth + rightDrawerWidth;

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
})(({ theme, open, rightDrawerOpen }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: rightDrawerOpen
      ? `calc(100% - ${bothDrawersWidth}px)`
      : `calc(100% - ${drawerWidth}px)`, // Adjust based on left drawer
    marginLeft: `${drawerWidth}px`, // Adjust based on left drawer
    marginRight: rightDrawerOpen ? `${rightDrawerWidth}px` : 0,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    width: rightDrawerOpen ? `calc(100% - ${rightDrawerWidth}px)` : "100%",
    marginLeft: `${drawerWidth}px`, // Adjust based on left drawer
    marginRight: rightDrawerOpen ? `${rightDrawerWidth}px` : 0,
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
  const [commands, setCommands] = useState({});
  const [promptCategories, setPromptCategories] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [conversationName, setConversationName] = useState("Test");
  const [conversation, setConversation] = useState([]);
  const [agentSettings, setAgentSettings] = useState({});
  const [agentCommands, setAgentCommands] = useState([]);
  const [providers, setProviders] = useState([]);

  const contentWidth =
    open && rightDrawerOpen
      ? `calc(100% - ${bothDrawersWidth}px)`
      : open && !rightDrawerOpen
      ? `calc(100% - ${drawerWidth}px)`
      : rightDrawerOpen
      ? `calc(100% - ${rightDrawerWidth}px)`
      : "100%";
  const handleArgsChange = (args) => {
    setChainArgs(args);
  };

  const router = useRouter();
  const pageName = router.pathname.split("/")[1];
  const agentName = useMemo(() => router.query.agent, [router.query.agent]);
  const tab = router.query.tab;

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
  const handleToggleAllCommands = async () => {
    await sdk.toggleCommand(
      agentName,
      "*",
      Object.values(commands).every((command) => command) ? false : true
    );
  };
  const handleToggleDarkMode = useCallback(() => {
    setDarkMode((oldVal) => {
      const newVal = !oldVal;
      setCookie("dark", newVal.toString());
      return newVal;
    });
  }, []);
  const agents = useSWR("agent", async () => sdk.getAgents());
  const handleChainChange = (event) => {
    setSelectedChain(event.target.value);
  };
  const pageTitle = () => {
    if (pageName == "chain") {
      return "Chain Management";
    } else if (pageName == "agent") {
      if (tab == 0) {
        return "Chat Mode";
      } else if (tab == 1) {
        return "Prompt Mode";
      } else if (tab == 3) {
        return "Instruct Mode";
      } else if (tab == 2) {
        return "Chain Execution Mode";
      } else {
        return "Agent Interactions";
      }
    } else if (pageName == "prompt") {
      return "Prompt Management";
    } else if (pageName == "train") {
      if (tab == 0) {
        return "Website Training";
      } else if (tab == 1) {
        return "File Training";
      } else if (tab == 2) {
        return "Text Training";
      } else if (tab == 3) {
        return "GitHub Training";
      } else if (tab == 5) {
        return "arXiv Training";
      } else if (tab == 4) {
        return "Memory Management";
      } else {
        return "Agent Training";
      }
    } else if (pageName == "settings") {
      return "Agent Settings";
    } else {
      return "Home";
    }
  };
  useEffect(() => {
    if (["prompt", "chain", ""].includes(pageName)) {
      setRightDrawerOpen(false);
    }
    if (pageName == "settings") {
      setRightDrawerOpen(true);
    }
  }, [pageName]);
  useEffect(() => {
    const fetchConversation = async () => {
      const convo = await sdk.getConversation(
        agentName,
        conversationName,
        100,
        1
      );
      setConversation(convo);
    };
    fetchConversation();
  }, [conversationName]);

  useEffect(() => {
    const fetchAgentConfig = async () => {
      const agentConfig = await sdk.getAgentConfig(agentName);
      setAgentSettings(agentConfig.settings);
      setAgentCommands(agentConfig.commands);
      setCommands(agentConfig.commands);
      console.log("Agent Name:", agentName);
      console.log("Agent Commands: ", agentConfig.commands);
    };
    fetchAgentConfig();
  }, [agentName]);
  return (
    <>
      <Head>
        <title>{pageName ? "AGiXT - " + pageTitle() : "AGiXT"}</title>
        <meta name="description" content="AGiXT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", marginTop: "-20px" }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            open={open}
            rightDrawerOpen={rightDrawerOpen}
            sx={{
              marginTop: "-20px",
            }}
          >
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: theme.palette.primary.main,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "bottom",
                  marginTop: "20px",
                }}
              >
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{ mr: 2, ...(open && { display: "none" }) }}
                >
                  <Menu />
                </IconButton>
                <MenuDarkSwitch
                  checked={darkMode}
                  onChange={handleToggleDarkMode}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "15px",
                  flexGrow: 1,
                }}
              >
                {pageName == "agent" ? (
                  <Box
                    sx={{
                      marginLeft: "10px",
                      marginTop: "-14px",
                      height: "10px",
                      width: "100%",
                    }}
                  ></Box>
                ) : null}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "22px",
                }}
              ></Box>
            </Toolbar>
            <Divider />
          </AppBar>
          <Main
            open={open}
            rightDrawerOpen={rightDrawerOpen}
            sx={{ padding: "0", maxWidth: contentWidth }}
          >
            <DrawerHeader />
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
              theme={theme}
              prompts={prompts}
              setPrompts={setPrompts}
              conversations={conversations}
              setConversationName={setConversationName}
              conversationName={conversationName}
              setConversations={setConversations}
              conversation={conversation}
              setConversation={setConversation}
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

import Link from "next/link";
import {
  List,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Input,
  Typography,
} from "@mui/material";
import { Home } from "@mui/icons-material";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ModelTrainingOutlinedIcon from "@mui/icons-material/ModelTrainingOutlined";
import EngineeringIcon from "@mui/icons-material/Engineering";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InsertLink from "@mui/icons-material/InsertLink";
import AddLink from "@mui/icons-material/AddLink";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import QuickreplyOutlinedIcon from "@mui/icons-material/QuickreplyOutlined";
import ElectricBoltOutlinedIcon from "@mui/icons-material/ElectricBoltOutlined";
import SensorOccupiedOutlinedIcon from "@mui/icons-material/SensorOccupiedOutlined";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { sdk } from "../../lib/apiClient";
import { fontWeight } from "@mui/system";

export default function MenuAgentList({
  data,
  theme,
  dark,
  setPrompts,
  promptCategories,
  setPromptCategories,
  setConversationName,
  setConversations,
}) {
  const agents = data;
  agents.sort((a, b) => {
    let nameA = typeof a.name === "string" ? a.name.trim().toLowerCase() : "";
    let nameB = typeof b.name === "string" ? b.name.trim().toLowerCase() : "";
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
  const router = useRouter();
  const pageName = router.pathname.split("/")[1];
  const agentName = router.query.agent;
  const defaultColor = dark
    ? theme.palette.primary.dark
    : theme.palette.primary.light;
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [openNewAgentDialog, setNewAgentOpenDialog] = useState(false);
  const [openNewPromptDialog, setNewPromptOpenDialog] = useState(false);
  const [openNewChainDialog, setNewChainOpenDialog] = useState(false);
  const [newConversationName, setNewConversationName] = useState("");
  const [openNewConversation, setOpenNewConversation] = useState(false);
  const [newPromptName, setNewPromptName] = useState("");
  const [promptCategory, setPromptCategory] = useState("Default");
  const [toggleNewPromptCategory, setToggleNewPromptCategory] = useState(false);
  const [promptBody, setPromptBody] = useState("");
  const [name, setName] = useState("");
  const [newChainName, setNewChainName] = useState("");
  const handleNewChain = async () => {
    await sdk.addChain(newChainName);
    mutate("chain");
    router.push(`/chain/${newChainName}?agent=${agentName}`);
    setNewChainOpenDialog(false);
  };
  const handleChainImport = async (event) => {
    const files = Array.from(event.target.files);
    for (let file of files) {
      const fileContent = await file.text();
      if (newChainName == "") {
        const filename = file.newChainName.replace(".json", "");
        setNewChainName(filename);
      }
      const steps = JSON.parse(fileContent);
      await sdk.addChain(newChainName);
      await sdk.importChain(newChainName, steps);
      mutate("chain");
      router.push(`/chain/${newChainName}?agent=${agentName}`);
    }
    setNewChainOpenDialog(false);
  };
  const handleNewAgent = async () => {
    sdk.addAgent(name, {});
    mutate("agent");
    router.push(`/settings?agent=${name}`);
    setNewAgentOpenDialog(false);
  };
  const handleAgentImport = async (event) => {
    const files = Array.from(event.target.files);
    for (let file of files) {
      // Create agent from file
      const fileContent = await file.text();
      if (name == "") {
        const fileName = file.name.replace(".json", "");
        setName(fileName);
      }
      const settings = JSON.parse(fileContent);
      sdk.addAgent(name, settings);
      mutate("agent");
      router.push(`/settings?agent=${name}`);
    }
    setNewAgentOpenDialog(false);
  };
  const handleImportConversation = async (event) => {
    const files = Array.from(event.target.files);
    for (let file of files) {
      const fileContent = await file.text();
      if (!newConversationName) {
        const fileName = file.name.replace(".json", "");
        setNewConversationName(fileName);
      }
      await sdk.newConversation(agentName, newConversationName, fileContent);
      const fetchConversations = async () => {
        const updatedConversations = await sdk.getConversations();
        setConversations(updatedConversations);
      };
      fetchConversations();
      setConversationName(newConversationName);
      router.push(`/agent?agent=${agentName}`);
    }
    setOpenNewConversation(false);
  };
  const handleAddConversation = async () => {
    if (!newConversationName) return;
    await sdk.newConversation(agentName, newConversationName);
    setNewConversationName("");
    setOpenNewConversation(false);
    const fetchConversations = async () => {
      const updatedConversations = await sdk.getConversations();
      setConversations(updatedConversations);
    };
    fetchConversations();
    setConversationName(newConversationName);
    router.push(`/agent?agent=${agentName}`);
  };
  const handleNewPrompt = async () => {
    await sdk.addPrompt(newPromptName, promptBody, promptCategory);
    const fetchPrompts = async () => {
      const prompts = await sdk.getPrompts(promptCategory);
      setPrompts(prompts);
    };
    fetchPrompts();
    if (toggleNewPromptCategory) {
      const fetchPromptCategories = async () => {
        const categories = await sdk.getPromptCategories();
        setPromptCategories(categories);
      };
      fetchPromptCategories();
    }
    setNewPromptOpenDialog(false);
    router.push(
      `/prompt?agent=${agentName}&promptCategory=${promptCategory}&prompt=${newPromptName}`
    );
  };

  const handleImportPrompt = async (event) => {
    const files = Array.from(event.target.files);
    for (let file of files) {
      const fileContent = await file.text();
      if (newPromptName == "") {
        const fileName = file.name.replace(".json", "");
        setNewPromptName(fileName);
      }
      await sdk.addPrompt(newPromptName, fileContent, promptCategory);
      const fetchPrompts = async () => {
        const prompts = await sdk.getPrompts(promptCategory);
        setPrompts(prompts);
      };
      fetchPrompts();
      if (toggleNewPromptCategory) {
        const fetchPromptCategories = async () => {
          const categories = await sdk.getPromptCategories();
          setPromptCategories(categories);
        };
        fetchPromptCategories();
      }
      setNewPromptOpenDialog(false);
      router.push(
        `/prompt?agent=${agentName}&promptCategory=${promptCategory}&prompt=${newPromptName}`
      );
    }
  };

  useEffect(() => {
    if (dark) {
      setSelectedColor("black");
    } else {
      setSelectedColor(theme.palette.primary);
    }
  }, [dark]);
  const helpLink =
    pageName == "prompt"
      ? "https://josh-xt.github.io/AGiXT/2-Concepts/5-Prompts.html"
      : pageName == "chain"
      ? "https://josh-xt.github.io/AGiXT/2-Concepts/6-Chains.html"
      : pageName == "train"
      ? "https://josh-xt.github.io/AGiXT/2-Concepts/8-Agent%20Training.html"
      : pageName == "settings"
      ? "https://josh-xt.github.io/AGiXT/2-Concepts/3-Agents.html"
      : "https://josh-xt.github.io/AGiXT/2-Concepts/9-Agent%20Interactions.html";
  return (
    <>
      <List sx={{ marginTop: "-8px" }} dense>
        <Link href={`/`} passHref>
          <ListItemButton
            selected={router.pathname == "/"}
            sx={{
              "&&.Mui-selected": {
                backgroundColor: selectedColor,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </Link>
        <a href={helpLink} target="_blank" rel="noreferrer">
          <ListItemButton
            sx={{
              "&&.Mui-selected": {
                backgroundColor: selectedColor,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Need Help?" />
          </ListItemButton>
        </a>
        <Divider />
        <ListItemButton onClick={() => setOpenNewConversation(true)}>
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <MapsUgcIcon />
          </ListItemIcon>
          <ListItemText primary="New Chat" />
        </ListItemButton>
        <ListItemButton onClick={() => setNewPromptOpenDialog(true)}>
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <AddCommentOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="New Prompt" />
        </ListItemButton>
        <ListItemButton onClick={() => setNewChainOpenDialog(true)}>
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <AddLink />
          </ListItemIcon>
          <ListItemText primary="New Chain" />
        </ListItemButton>
        <ListItemButton onClick={() => setNewAgentOpenDialog(true)}>
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <PersonAddOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="New Agent" />
        </ListItemButton>
        <Divider />
        {agentName && (
          <>
            <Link
              href={`/${
                pageName != "" ? pageName : "agent"
              }?agent=${agentName}&tab=${router.query.tab || "0"}`}
              passHref
            >
              <ListItemButton
                sx={{
                  "&&.Mui-selected": {
                    backgroundColor: selectedColor,
                  },
                }}
                selected={true}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <DirectionsRunIcon />
                </ListItemIcon>
                <ListItemText primary={agentName} />
              </ListItemButton>
            </Link>
            <Link href={`/agent?agent=${agentName}&tab=0`} passHref>
              <ListItemButton
                variant="contained"
                sx={{
                  pl: "2rem",
                  "&&.Mui-selected": {
                    backgroundColor: selectedColor,
                  },
                }}
                selected={pageName == "agent" && router.query.tab == 0}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <ChatBubbleOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Chat" />
              </ListItemButton>
            </Link>
            <Link href={`/agent?agent=${agentName}&tab=3`} passHref>
              <ListItemButton
                variant="contained"
                sx={{
                  pl: "2rem",
                  "&&.Mui-selected": {
                    backgroundColor: selectedColor,
                  },
                }}
                selected={pageName == "agent" && router.query.tab == 3}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <ElectricBoltOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Instruct" />
              </ListItemButton>
            </Link>
            <Link href={`/agent?agent=${agentName}&tab=1`} passHref>
              <ListItemButton
                variant="contained"
                sx={{
                  pl: "2rem",
                  "&&.Mui-selected": {
                    backgroundColor: selectedColor,
                  },
                }}
                selected={pageName == "agent" && router.query.tab == 1}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <QuickreplyOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Run Prompt" />
              </ListItemButton>
            </Link>
            <Link href={`/agent?agent=${agentName}&tab=2`} passHref>
              <ListItemButton
                variant="contained"
                sx={{
                  pl: "2rem",
                  "&&.Mui-selected": {
                    backgroundColor: selectedColor,
                  },
                }}
                selected={pageName == "agent" && router.query.tab == 2}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <PlayCircleFilledWhiteOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Run Chain" />
              </ListItemButton>
            </Link>
            <Link href={`/train?agent=${agentName}`} passHref>
              <ListItemButton
                variant="contained"
                sx={{
                  pl: "2rem",
                  "&&.Mui-selected": {
                    backgroundColor: selectedColor,
                  },
                }}
                selected={pageName == "train"}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <ModelTrainingOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Training" />
              </ListItemButton>
            </Link>
            <Link href={`/prompt?agent=${agentName}`} passHref>
              <ListItemButton
                variant="contained"
                sx={{
                  pl: "2rem",
                  "&&.Mui-selected": {
                    backgroundColor: selectedColor,
                  },
                }}
                selected={pageName == "prompt"}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <RateReviewOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Prompts" />
              </ListItemButton>
            </Link>
            <Link href={`/chain/?agent=${agentName}`} passHref>
              <ListItemButton
                variant="contained"
                sx={{
                  pl: "2rem",
                  "&&.Mui-selected": {
                    backgroundColor: selectedColor,
                  },
                }}
                selected={pageName == "chain"}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <InsertLink />
                </ListItemIcon>
                <ListItemText primary="Chains" />
              </ListItemButton>
            </Link>
            <Link href={`/settings?agent=${agentName}`} passHref>
              <ListItemButton
                variant="contained"
                sx={{
                  pl: "2rem",
                  "&&.Mui-selected": {
                    backgroundColor: selectedColor,
                  },
                }}
                selected={pageName == "settings"}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <SettingsOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </Link>
            <Divider />
          </>
        )}
        {Array.isArray(agents) &&
          agents.map(
            (agent) =>
              agent.name != "undefined" && (
                <>
                  {agentName == agent.name ? (
                    <></>
                  ) : (
                    <Link
                      href={`/${pageName != "" ? pageName : "agent"}?agent=${
                        agent.name
                      }&tab=${router.query.tab || "0"}`}
                      passHref
                    >
                      <ListItemButton
                        selected={agentName == agent.name}
                        sx={{
                          "&&.Mui-selected": {
                            backgroundColor: selectedColor,
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                          {agentName != agent.name ? (
                            <EngineeringIcon />
                          ) : (
                            <DirectionsRunIcon />
                          )}
                        </ListItemIcon>
                        <ListItemText primary={agent.name} />
                      </ListItemButton>
                    </Link>
                  )}
                </>
              )
          )}
      </List>
      <Dialog
        open={openNewPromptDialog}
        onClose={() => setNewPromptOpenDialog(false)}
      >
        <DialogTitle>Create New Prompt Template</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={toggleNewPromptCategory}
                onChange={() =>
                  setToggleNewPromptCategory(!toggleNewPromptCategory)
                }
                name="toggleNewPromptCategory"
                color="primary"
              />
            }
            label={"New Category"}
          />
          {toggleNewPromptCategory ? (
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="New Prompt Category"
              type="text"
              fullWidth
              value={promptCategory}
              onChange={(e) => setPromptCategory(e.target.value)}
              variant="outlined"
              color="info"
            />
          ) : (
            <FormControl fullWidth>
              <InputLabel id="prompt-category-label">
                Select a Prompt Category
              </InputLabel>
              <Select
                labelId="promptCategory"
                id="promptCategory"
                label="Select a Prompt Category"
                value={promptCategory}
                onChange={(e) => setPromptCategory(e.target.value)}
              >
                {promptCategories &&
                  Object.values(promptCategories).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New Prompt Name"
            type="text"
            fullWidth
            value={newPromptName}
            onChange={(e) => setNewPromptName(e.target.value)}
            variant="outlined"
            color="info"
          />
          <TextField
            autoFocus
            margin="dense"
            id="promptBody"
            label="New Prompt Content"
            type="text"
            fullWidth
            value={promptBody}
            onChange={(e) => setPromptBody(e.target.value)}
            variant="outlined"
            color="info"
            multiline
            rows={4}
          />
          <Typography variant="h6" component="h2" marginY={"1rem"}>
            Import Prompts
          </Typography>
          <Input type="file" onChange={handleImportPrompt} />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setNewPromptOpenDialog(false)}>
            Cancel
          </Button>
          <Button color="info" onClick={handleNewPrompt}>
            Create Prompt
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openNewAgentDialog}
        onClose={() => setNewAgentOpenDialog(false)}
      >
        <DialogTitle>Create New Agent</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New Agent Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            color="info"
          />
          <Typography variant="h6" component="h2" marginY={"1rem"}>
            Import an Agent
          </Typography>
          <Input type="file" onChange={handleAgentImport} />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setNewAgentOpenDialog(false)}>
            Cancel
          </Button>
          <Button color="info" onClick={handleNewAgent}>
            Create Agent
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openNewChainDialog}
        onClose={() => setNewChainOpenDialog(false)}
      >
        <DialogTitle>Create New Chain</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Chain Name"
            value={newChainName}
            onChange={(e) => {
              setNewChainName(e.target.value);
            }}
          />
          <Typography variant="h6" component="h2" marginY={"1rem"}>
            Import a Chain
          </Typography>
          <Input type="file" onChange={handleChainImport} />
          <DialogActions>
            <Button color="error" onClick={() => setNewChainOpenDialog(false)}>
              Cancel
            </Button>
            <Button color="info" onClick={handleNewChain}>
              Create Chain
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openNewConversation}
        onClose={() => setOpenNewConversation(false)}
      >
        <DialogTitle>Create New Conversation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New Conversation Name"
            type="text"
            fullWidth
            value={newConversationName}
            onChange={(e) => setNewConversationName(e.target.value)}
            variant="outlined"
            color="info"
          />
          <Divider />
          <Typography variant="h6" component="h2" marginY={"1rem"}>
            Import a Conversation
          </Typography>
          <Input
            type="file"
            onChange={handleImportConversation}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewConversation(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleAddConversation} color="info">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

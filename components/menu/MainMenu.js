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
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import InsertLink from "@mui/icons-material/InsertLink";
import AddLink from "@mui/icons-material/AddLink";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MenuAgentList({
  data,
  theme,
  dark,
  setPrompts,
  promptCategories,
  setPromptCategories,
}) {
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
  useEffect(() => {
    if (dark) {
      setSelectedColor(theme.palette.primary.dark);
    } else {
      setSelectedColor(theme.palette.primary);
    }
  }, [dark]);
  return (
    <>
      <List>
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
        <Divider />

        <ListItemButton
          key={"new"}
          selected={
            router.pathname.split("/")[1] == "new" &&
            router.pathname.split("/")[2] == "chain"
          }
          onClick={() => setNewChainOpenDialog(true)}
        >
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <AddLink />
          </ListItemIcon>
          <ListItemText primary="New Chain" />
        </ListItemButton>

        <ListItemButton
          selected={
            router.pathname.split("/")[1] == "new" &&
            router.pathname.split("/")[2] == "prompt"
          }
          onClick={() => setNewPromptOpenDialog(true)}
        >
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <AddCommentOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="New Prompt" />
        </ListItemButton>

        <ListItemButton
          selected={
            router.pathname.split("/")[1] == "new" &&
            router.pathname.split("/")[2] == "agent"
          }
          onClick={() => setNewAgentOpenDialog(true)}
        >
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <PersonAddOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="New Agent" />
        </ListItemButton>

        <Divider />
        {Array.isArray(data) &&
          data.map(
            (agent) =>
              agent.name != "undefined" && (
                <>
                  {agentName == agent.name ? <Divider /> : null}
                  <Link
                    href={
                      pageName != "new"
                        ? `/${pageName}?agent=${agent.name}&tab=${
                            router.query.tab || 0
                          }`
                        : `/agent?agent=${agent.name}`
                    }
                    key={agent.name}
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
                    {agentName == agent.name ? (
                      <>
                        <Link href={`/train?agent=${agent.name}`} passHref>
                          <Link href={`/agent?agent=${agent.name}`} passHref>
                            <ListItemButton
                              variant="contained"
                              sx={{
                                pl: "2rem",
                                "&&.Mui-selected": {
                                  backgroundColor: selectedColor,
                                },
                              }}
                              selected={
                                pageName == "agent" && router.query.tab != 4
                              }
                            >
                              <ListItemIcon sx={{ minWidth: "30px" }}>
                                <PlayCircleFilledWhiteOutlinedIcon />
                              </ListItemIcon>
                              Interact
                            </ListItemButton>
                          </Link>
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
                            Training
                          </ListItemButton>
                        </Link>
                        <Link href={`/prompt?agent=${agent.name}`} passHref>
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
                        <Link href={`/chain/?agent=${agent.name}`} passHref>
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
                        <Link href={`/settings?agent=${agent.name}`} passHref>
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
                            Settings
                          </ListItemButton>
                        </Link>
                        <Divider />
                      </>
                    ) : null}
                  </Link>
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
          <Typography variant="h6" component="h2" marginY={"1rem"}>
            Add a New Chain
          </Typography>
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
    </>
  );
}

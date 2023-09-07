import Link from "next/link";
import {
  List,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { AddCircle, Home } from "@mui/icons-material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ModelTrainingOutlinedIcon from "@mui/icons-material/ModelTrainingOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import ChatBubble from "@mui/icons-material/ChatBubble";
import InsertLink from "@mui/icons-material/InsertLink";
import { useRouter } from "next/router";

export default function MenuAgentList({ data }) {
  const router = useRouter();
  const pageName = router.pathname.split("/")[1];
  const agentName = router.query.agent;
  return (
    <List>
      <Link href={`/prompt`} passHref>
        <ListItemButton selected={pageName == "prompt"}>
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <ChatBubble />
          </ListItemIcon>
          <ListItemText primary="Manage Prompts" />
        </ListItemButton>
      </Link>
      <Link href={`/chain`} passHref>
        <ListItemButton selected={pageName == "chain"}>
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <InsertLink />
          </ListItemIcon>
          <ListItemText primary="Manage Chains" />
        </ListItemButton>
      </Link>
      <Divider />

      <Link href={`/new/agent`} passHref>
        <ListItemButton
          selected={
            router.pathname.split("/")[1] == "new" &&
            router.pathname.split("/")[2] == "agent"
          }
        >
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <AddCircle />
          </ListItemIcon>
          <ListItemText primary="Add A New Agent" />
        </ListItemButton>
      </Link>

      <Divider />

      { Array.isArray(data) && data.map((agent) => (
        <Link
          href={`/${pageName}?agent=${agent.name}&tab=${router.query.tab || 0}`}
          key={agent.name}
          passHref
        >
          <ListItemButton selected={agentName == agent.name}>
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <SmartToyOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={agent.name} />
          </ListItemButton>
          {agentName == agent.name ? (
            <>
              <Link href={`/train?agent=${agent.name}`} passHref>
                <Link href={`/agent?agent=${agent.name}`} passHref>
                  <ListItemButton
                    variant="contained"
                    color="primary"
                    sx={{ pl: "2rem" }}
                    selected={pageName == "agent" && router.query.tab != 4}
                  >
                    <ListItemIcon sx={{ minWidth: "30px" }}>
                      <PlayCircleFilledWhiteOutlinedIcon />
                    </ListItemIcon>
                    Interact
                  </ListItemButton>
                </Link>
                <ListItemButton
                  variant="contained"
                  color="primary"
                  sx={{ pl: "2rem" }}
                  selected={pageName == "train"}
                >
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <ModelTrainingOutlinedIcon />
                  </ListItemIcon>
                  Training
                </ListItemButton>
              </Link>
              <Link href={`/settings?agent=${agent.name}`} passHref>
                <ListItemButton
                  variant="contained"
                  color="primary"
                  sx={{ pl: "2rem" }}
                  selected={pageName == "settings"}
                >
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <SettingsOutlinedIcon />
                  </ListItemIcon>
                  Settings
                </ListItemButton>
              </Link>
            </>
          ) : null}
        </Link>
      ))}
    </List>
  );
}

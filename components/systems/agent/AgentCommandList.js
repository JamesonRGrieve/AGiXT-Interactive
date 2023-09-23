import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  Typography,
  Switch,
  Divider,
} from "@mui/material";
import AgentCommand from "./AgentCommand";
import { sdk } from "../../../lib/apiClient";

export default function AgentCommandList({ commands, setCommands }) {
  const agentName = useRouter().query.agent;
  const [commandToggled, setCommandToggled] = useState(false);
  const handleToggleAllCommands = async () => {
    await sdk.toggleCommand(
      agentName,
      "*",
      Object.values(commands).every((command) => command) ? false : true
    );
  };
  useEffect(() => {
    const fetchCommands = async () => {
      const commandList = await sdk.getCommands(agentName);
      setCommands(commandList);
    };
    if (agentName) {
      fetchCommands();
    }
  }, [commandToggled]);
  return (
    <List dense>
      <ListItem disablePadding>
        <ListItemButton>
          <Typography variant="body2">All Commands</Typography>
        </ListItemButton>
        <Switch
          checked={Object.values(commands).every((command) => command) || false}
          onChange={handleToggleAllCommands}
          inputProps={{ "aria-label": "Enable/Disable All Commands" }}
        />
      </ListItem>
      <Divider />
      {Object.keys(commands).map((command) => (
        <AgentCommand
          key={command}
          name={command}
          enabled={commands[command]}
          setCommandToggled={setCommandToggled}
        />
      ))}
    </List>
  );
}

import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
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

export default function AgentCommandList({ commands }) {
  const agentName = useMemo(
    () => useRouter().query.agent,
    [useRouter().query.agent]
  );
  const [commandToggled, setCommandToggled] = useState(false);
  const handleToggleAllCommands = async () => {
    await sdk.toggleCommand(
      agentName,
      "*",
      Object.values(commands).every((command) => command) ? false : true
    );
  };
  // TODO: Command list is not updating the toggles when agents are changed. Commands list is updating, but not the toggles.

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
      {commands
        ? Object.keys(commands)
            .sort()
            .map((command) => (
              <AgentCommand
                key={command}
                name={command}
                enabled={commands[command]}
                setCommandToggled={setCommandToggled}
              />
            ))
        : null}
    </List>
  );
}

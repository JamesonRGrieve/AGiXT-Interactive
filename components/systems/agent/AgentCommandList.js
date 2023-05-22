import { useRouter } from "next/router";
import { mutate } from "swr";
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

export default function AgentCommandList({ data }) {
  const agentName = useRouter().query.agent;
  const handleToggleAllCommands = async () => {
    await sdk.toggleCommand(
      agentName,
      "*",
      Object.values(data).every((command) => command) ? false : true
    );
    mutate(`agent/${agentName}/commands`);
  };
  return (
    <List dense>
      <ListItem disablePadding>
        <ListItemButton>
          <Typography variant="body2">All Commands</Typography>
        </ListItemButton>
        <Switch
          checked={Object.values(data).every((command) => command) || false}
          onChange={handleToggleAllCommands}
          inputProps={{ "aria-label": "Enable/Disable All Commands" }}
        />
      </ListItem>
      <Divider />
      {Object.keys(data).map((command) => (
        <AgentCommand key={command} name={command} enabled={data[command]} />
      ))}
    </List>
  );
}

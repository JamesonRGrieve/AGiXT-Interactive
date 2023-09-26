import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { sdk } from "../../../lib/apiClient";
import { ListItem, ListItemButton, Typography, Switch } from "@mui/material";

export default function AgentCommandsList({
  name,
  enabled,
  setCommandToggled,
}) {
  const agentName = useRouter().query.agent;
  const [localEnabled, setLocalEnabled] = useState(enabled);
  const handleToggleCommand = async () => {
    setLocalEnabled((old) => !old);
    await sdk.toggleCommand(agentName, name, enabled ? false : true);
    setCommandToggled(name + enabled);
  };
  useEffect(() => {
    setLocalEnabled(enabled);
  }, [enabled]);

  return (
    <>
      <ListItem key={name} disablePadding>
        <ListItemButton onClick={() => setOpen((old) => !old)}>
          <Typography variant="body2">{name}</Typography>
        </ListItemButton>
        <Switch
          checked={localEnabled}
          onChange={() => handleToggleCommand(name)}
          inputProps={{ "aria-label": "Enable/Disable Command" }}
        />
      </ListItem>
    </>
  );
}

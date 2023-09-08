import { useRouter } from "next/router";
import { sdk } from "../../../lib/apiClient";
import { mutate } from "swr";
import { ListItem, ListItemButton, Typography, Switch } from "@mui/material";

export default function AgentCommandsList({ name, enabled }) {
  const agentName = useRouter().query.agent;
  //const [open, setOpen] = useState(false);
  //const [theArgs, setTheArgs] = useState({...args});
  const handleToggleCommand = async () => {
    await sdk.toggleCommand(agentName, name, enabled ? false : true);
    mutate(`agent/${agentName}/commands`);
  };
  console.log('AgentCommand name: ', name);
  return (
    <>
      <ListItem key={name} disablePadding>
        <ListItemButton onClick={() => setOpen((old) => !old)}>
          <Typography variant="body2">{name}</Typography>
        </ListItemButton>
        <Switch
          checked={enabled}
          onChange={() => handleToggleCommand(name)}
          inputProps={{ "aria-label": "Enable/Disable Command" }}
        />
      </ListItem>
      {/*open? 
          <>
            <Divider />
              {Object.keys(args).map((arg) => <ListItem key={arg}>
              <TextField
                label={arg}
                value={theArgs[arg]}
                onChange={(e) => {
                  const newArgs = {...theArgs};
                  newArgs[arg] = e.target.value;
                  setTheArgs(newArgs);
                }}
              />
              </ListItem>)}
              <ListItem>
                <Button variant="contained" color="primary" onClick={handleSaveArgs} >Save Changes</Button>
              </ListItem>
            <Divider />
            </>
              :null*/}
    </>
  );
}

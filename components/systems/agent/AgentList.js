import Link from "next/link";
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { RunCircle, StopCircle, AddCircle, Home } from "@mui/icons-material";
import { useRouter } from "next/router";

export default function MenuAgentList({ data }) {
  const router = useRouter();
  const pageName = router.pathname.split("/")[1];
  return (
    <List>
      <Link href={`/agent`} passHref>
        <ListItemButton selected={pageName == "agent" && !router.query.agent}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Agent Homepage" />
        </ListItemButton>
      </Link>

      <Link href={`/new/agent`} passHref>
        <ListItemButton
          selected={
            router.pathname.split("/")[1] == "new" &&
            router.pathname.split("/")[2] == "agent"
          }
        >
          <ListItemIcon>
            <AddCircle />
          </ListItemIcon>
          <ListItemText primary="Add A New Agent" />
        </ListItemButton>
      </Link>

      <Divider />

      {data.map((agent) => (
        <Link
          href={`/${pageName}/${agent.name}?tab=${router.query.tab || 0}`}
          key={agent.name}
          passHref
        >
          <ListItemButton selected={router.query.agent == agent.name}>
            <ListItemIcon>
              {agent.status ? <RunCircle /> : <StopCircle />}
            </ListItemIcon>
            <ListItemText primary={agent.name} />
          </ListItemButton>
        </Link>
      ))}
    </List>
  );
}

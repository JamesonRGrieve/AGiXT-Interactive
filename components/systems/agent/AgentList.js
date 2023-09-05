import Link from "next/link";
import {
  List,
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
  const agentName =
    pageName == "agent" ? router.query.agent : router.query.train;
  return (
    <List>
      <Link href={`/${pageName}`} passHref>
        <ListItemButton selected={agentName}>
          <ListItemIcon sx={{ minWidth: "30px" }}>
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
          <ListItemIcon sx={{ minWidth: "30px" }}>
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
          <ListItemButton selected={agentName == agent.name}>
            <ListItemIcon sx={{ minWidth: "30px" }}>
              {agent.status ? <RunCircle /> : <StopCircle />}
            </ListItemIcon>
            <ListItemText primary={agent.name} />
          </ListItemButton>
          {agentName == agent.name ? (
            <>
              <Link href={`/train/${agent.name}`} passHref>
                <ListItemButton
                  variant="contained"
                  color="primary"
                  sx={{ pl: "4rem" }}
                  selected={pageName == "train"}
                >
                  Train
                </ListItemButton>
              </Link>
              <Link href={`/agent/${agent.name}`} passHref>
                <ListItemButton
                  variant="contained"
                  color="primary"
                  sx={{ pl: "4rem" }}
                  selected={pageName == "agent" && router.query.tab != 4}
                >
                  Interact
                </ListItemButton>
              </Link>
              <Link href={`/agent/${agent.name}?tab=4`} passHref>
                <ListItemButton
                  variant="contained"
                  color="primary"
                  sx={{ pl: "4rem" }}
                  selected={pageName == "agent" && router.query.tab == 4}
                >
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

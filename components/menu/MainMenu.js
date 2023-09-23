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
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import InsertLink from "@mui/icons-material/InsertLink";
import AddLink from "@mui/icons-material/AddLink";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MenuAgentList({ data, theme, dark }) {
  const router = useRouter();
  const pageName = router.pathname.split("/")[1];
  const agentName = router.query.agent;
  const defaultColor = dark
    ? theme.palette.primary.dark
    : theme.palette.primary.light;
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  useEffect(() => {
    if (dark) {
      setSelectedColor(theme.palette.primary.dark);
    } else {
      setSelectedColor(theme.palette.primary);
    }
  }, [dark]);
  return (
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
      <Link href={`/new/chain`}>
        <ListItemButton
          key={"new"}
          selected={
            router.pathname.split("/")[1] == "new" &&
            router.pathname.split("/")[2] == "chain"
          }
        >
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <AddLink />
          </ListItemIcon>
          <ListItemText primary="New Chain" />
        </ListItemButton>
      </Link>
      <Link href={`/new/prompt`} passHref>
        <ListItemButton
          selected={
            router.pathname.split("/")[1] == "new" &&
            router.pathname.split("/")[2] == "prompt"
          }
        >
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <AddCommentOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="New Prompt" />
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
            <PersonAddOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="New Agent" />
        </ListItemButton>
      </Link>

      <Divider />

      {Array.isArray(data) &&
        data.map(
          (agent) =>
            agent.name != "undefined" && (
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
                  </>
                ) : null}
              </Link>
            )
        )}
    </List>
  );
}

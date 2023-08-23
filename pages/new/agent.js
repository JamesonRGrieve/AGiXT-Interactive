import { useState } from "react";
import { useRouter } from "next/router";
import { Container, TextField, Button, Typography } from "@mui/material";
import { mutate } from "swr";
import useSWR from "swr";
import PopoutDrawerWrapper from "../../components/menu/PopoutDrawerWrapper";
import AgentList from "../../components/systems/agent/AgentList";
import { sdk } from "../../lib/apiClient";
export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const handleCreate = async () => {
    sdk.addAgent({ agentName: name, settings: {} });
    mutate("agent");
    router.push(`/agent/${name}?config=true`);
  };
  const agents = useSWR("agent", async () => sdk.getAgents());
  return (
    <PopoutDrawerWrapper
      title={"Add a New Agent"}
      leftHeading={"Agents"}
      leftSWR={agents}
      leftMenu={AgentList}
      rightHeading={null}
      rightSWR={null}
      rightMenu={null}
    >
      <Container>
        <Typography variant="h6" component="h2" marginY={"1rem"}>
          Add a New Agent
        </Typography>
        <form>
          <TextField
            fullWidth
            variant="outlined"
            label="Agent Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreate}
            sx={{ marginY: "1rem" }}
          >
            Add a New Agent
          </Button>
        </form>
      </Container>
    </PopoutDrawerWrapper>
  );
}

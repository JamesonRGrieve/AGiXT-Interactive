import { useState } from "react";
import { useRouter } from "next/router";
import { Container, TextField, Button, Typography } from "@mui/material";
import { mutate } from "swr";
import { sdk } from "../../lib/apiClient";
export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const handleCreate = async () => {
    sdk.addAgent(name, {});
    mutate("agent");
    router.push(`/settings?agent=${name}`);
  };
  return (
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
  );
}

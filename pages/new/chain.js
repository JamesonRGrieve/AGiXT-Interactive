import { useState } from "react";
import { useRouter } from "next/router";
import { Container, TextField, Button, Typography, Input } from "@mui/material";
import { mutate } from "swr";
import { sdk } from "../../lib/apiClient";
export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();
  const handleCreate = async () => {
    await sdk.addChain(name);
    mutate("chain");
    router.push(`/chain/${name}?agent=${router.query.agent}`);
  };
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    for (let file of files) {
      const fileContent = await file.text();
      if (name == "") {
        const fileName = file.name.replace(".json", "");
        setName(fileName);
      }
      const steps = JSON.parse(fileContent);
      await sdk.addChain(name);
      await sdk.importChain(name, steps);
      mutate("chain");
      router.push(`/chain/${name}?agent=${router.query.agent}`);
    }
  };

  return (
    <Container>
      <Typography variant="h6" component="h2" marginY={"1rem"}>
        Add a New Chain
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Chain Name"
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
        Add a New Chain
      </Button>
      <Typography variant="h6" component="h2" marginY={"1rem"}>
        Import a Chain
      </Typography>
      <Input type="file" onChange={handleFileUpload} />
    </Container>
  );
}

import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  TextField,
  Container,
  Typography,
  Divider,
} from "@mui/material";
import { sdk } from "../../lib/apiClient";

import ChainSelector from "../../components/systems/chain/ChainSelector";
import ChainArgsEditor from "../../components/systems/chain/ChainArgsEditor";

const ChainExecution = () => {
  const [chains, setChains] = useState([]);
  const [selectedChain, setSelectedChain] = useState("Smart Chat");
  const [chainArgs, setChainArgs] = useState({});
  const [userInput, setUserInput] = useState("");
  const router = useRouter();
  const agentName = router.query.agent || "";
  const handleSelect = (chain) => {
    setSelectedChain(chain);
  };

  const handleArgsChange = (args) => {
    setChainArgs(args);
  };

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const runChain = async () => {
    const response = await sdk.runChain(
      selectedChain,
      userInput,
      agentName,
      false, // All responses = false
      1, // From step = 1
      chainArgs
    );
    // handle response
  };

  return (
    <Container>
      <Typography variant="h4">Chain Execution</Typography>
      <br />
      <ChainSelector
        chains={chains}
        sdk={sdk}
        selectedChain={selectedChain}
        onSelect={handleSelect}
      />
      <TextField
        label="User Input"
        value={userInput}
        onChange={handleUserInput}
        fullWidth
      />

      <ChainArgsEditor
        selectedChain={selectedChain}
        sdk={sdk}
        chainArgs={chainArgs}
        setChainArgs={setChainArgs}
        onChange={handleArgsChange}
      />

      <Button onClick={runChain} color={"info"}>
        Execute Chain
      </Button>
    </Container>
  );
};

export default ChainExecution;

import React, { useState, useEffect } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { sdk } from "../../../lib/apiClient";
export default function ChainSelector({
  chains,
  selectedChain,
  setSelectedChain,
}) {
  const [chainOptions, setChainOptions] = useState([]);

  useEffect(() => {
    const fetchChains = async () => {
      const chains = await sdk.getChains();
      setChainOptions(chains);
    };
    fetchChains();
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel>Select a Chain</InputLabel>
      <Select
        label="Select Chain"
        value={selectedChain}
        onChange={(e) => setSelectedChain(e.target.value)}
        fullWidth
      >
        {chainOptions.map((chain) => (
          <MenuItem key={chain} value={chain}>
            {chain}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

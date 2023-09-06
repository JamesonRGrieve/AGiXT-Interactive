import React, { useState, useEffect } from "react";
import { Select, MenuItem } from "@mui/material";

const ChainSelector = ({ chains, sdk, selectedChain, onSelect }) => {
  const [chainOptions, setChainOptions] = useState([]);

  useEffect(() => {
    const fetchChains = async () => {
      const chains = await sdk.getChains();
      setChainOptions(chains);
    };
    fetchChains();
  }, [sdk]);

  const handleChange = (event) => {
    onSelect(event.target.value);
  };

  return (
    <Select
      label="Select Chain"
      value={selectedChain}
      onChange={handleChange}
      fullWidth
    >
      {chainOptions.map((chain) => (
        <MenuItem key={chain} value={chain}>
          {chain}
        </MenuItem>
      ))}
    </Select>
  );
};

export default ChainSelector;

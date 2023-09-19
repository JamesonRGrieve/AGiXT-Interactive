import React, { useState, useEffect, use } from "react";
import { TextField, Container } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";

const ChainArgs = ({
  selectedChain,
  sdk,
  chainArgs,
  setChainArgs,
  singleStep = false,
  fromStep = 0,
  allResponses = false,
  setSingleStep,
  setFromStep,
  setAllResponses,
  useSelectedAgent,
  setUseSelectedAgent,
  onChange,
}) => {
  const [argNames, setArgNames] = useState([]);

  useEffect(() => {
    const fetchDefaults = async () => {
      const args = await sdk.getChainArgs(selectedChain);
      const newDefaults = {};
      args.forEach((arg) => (newDefaults[arg] = ""));
    };

    if (selectedChain) {
      fetchDefaults();
    }
  }, [selectedChain]);

  useEffect(() => {
    const fetchArgs = async () => {
      const args = await sdk.getChainArgs(selectedChain);
      setArgNames(args);
    };

    if (selectedChain) {
      fetchArgs();
    }
  }, [selectedChain]);

  const handleChange = (event) => {
    const updatedArgs = {
      ...chainArgs,
      [event.target.name]: event.target.value,
    };
    onChange(updatedArgs);
  };

  return (
    <>
      {argNames.map((name) => {
        return (
          <TextField
            key={name}
            label={name}
            name={name}
            value={chainArgs[name]}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
        );
      })}
    </>
  );
};

export default ChainArgs;

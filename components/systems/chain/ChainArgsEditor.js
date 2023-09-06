import React, { useState, useEffect, use } from "react";
import { TextField } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const ChainArgsEditor = ({
  selectedChain,
  sdk,
  chainArgs,
  setChainArgs,
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
          name !== "user_input" && (
            <FormGroup key={name}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(chainArgs[name])}
                    onChange={(e) =>
                      setChainArgs({ ...chainArgs, [name]: e.target.checked })
                    }
                  />
                }
                label={`Override ${name}`}
              />
              {chainArgs[name] && (
                <TextField name={name} label={name} onChange={handleChange} />
              )}
            </FormGroup>
          )
        );
      })}
    </>
  );
};

export default ChainArgsEditor;

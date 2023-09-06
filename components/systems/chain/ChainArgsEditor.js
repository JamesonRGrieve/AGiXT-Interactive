import React, { useState, useEffect, use } from "react";
import { TextField, Container } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import { all } from "axios";

const ChainArgsEditor = ({
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
    <Container>
      {/* Use selected agent checkbox */}
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={useSelectedAgent}
              onChange={(e) => setUseSelectedAgent(e.target.checked)}
            />
          }
          label="Use Selected Agent"
        />
      </FormGroup>
      <Divider />
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
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={allResponses}
              onChange={(e) => setAllResponses(e.target.checked)}
            />
          }
          label="Show All Responses"
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={singleStep}
              onChange={(e) => setSingleStep(e.target.checked)}
            />
          }
          label="Single Step"
        />
      </FormGroup>
      {singleStep ? (
        <FormGroup>
          <TextField
            fullWidth
            type="number"
            label="Step"
            value={fromStep}
            onChange={(e) => setFromStep(e.target.value)}
            sx={{ mb: 2 }}
          />
        </FormGroup>
      ) : (
        <TextField
          fullWidth
          type="number"
          label="From Step"
          value={fromStep}
          onChange={(e) => setFromStep(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}
    </Container>
  );
};

export default ChainArgsEditor;

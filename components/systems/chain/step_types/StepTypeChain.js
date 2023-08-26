import { Select, MenuItem, TextField } from "@mui/material";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { mutate } from "swr";
import { sdk } from "../../../../lib/apiClient";
import useSWR from "swr";
export default function StepTypeCommand({ prompt, set_prompt, update }) {
  const [chain, setChain] = useState(-1);
  const chains = useSWR("chain", async () => await sdk.getChains());
  useEffect(() => {
    const chain = prompt.slice(11, indexOf(")"));
    setChain(
      chains.data.steps && prompt
        ? chains.data.steps.findIndex((chainName) => chainName == chain)
        : -1
    );
  }, [chains.data.steps, prompt]);
  return (
    <>
      <Select
        label="Chain"
        sx={{ mx: "0.5rem" }}
        value={chain}
        onChange={(e) => {
          setChain(e.target.value);
          if (e.target.value !== -1)
            set_prompt(`run_chain("${chains[chain]}")`);
          update(true);
        }}
      >
        <MenuItem value={-1}>Select a Chain...</MenuItem>
        {chains?.data?.steps.map((chain, index) => {
          return (
            <MenuItem key={index} value={index}>
              {chain}
            </MenuItem>
          );
        })}
      </Select>
    </>
  );
}

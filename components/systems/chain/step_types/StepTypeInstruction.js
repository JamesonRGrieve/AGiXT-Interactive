import { Select, MenuItem, TextField } from "@mui/material";
import { sdk } from "../../../../lib/apiClient";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { mutate } from "swr";
import useSWR from "swr";
export default function StepTypeInstruction({
  agent_name,
  set_agent_name,
  prompt,
  set_prompt,
  update,
}) {
  const [agent, setAgent] = useState(-1);
  const [instruction, setInstruction] = useState("");
  const agents = useSWR("agent", async () => await sdk.getAgents());
  useEffect(() => {
    setInstruction(prompt);
  }, [prompt]);
  useEffect(() => {
    setAgent(
      agents.data && agent_name
        ? agents.data.findIndex((agent) => agent.name == agent_name)
        : -1
    );
  }, [agents.data, agent_name]);
  return (
    <>
      <Select
        label="Agent"
        sx={{ mx: "0.5rem" }}
        value={agent}
        onChange={(e) => {
          setAgent(e.target.value);
          if (e.target.value != -1)
            set_agent_name(agents.data[e.target.value].name);
          update(true);
        }}
      >
        <MenuItem value={-1}>Select an Agent...</MenuItem>
        {agents?.data?.map((agent, index) => {
          return (
            <MenuItem key={index} value={index}>
              {agent.name}
            </MenuItem>
          );
        })}
      </Select>
      <TextField
        label="Instruction"
        multiline
        lines={20}
        sx={{ mx: "0.5rem", flex: 1 }}
        value={instruction}
        onChange={(e) => {
          setInstruction(e.target.value);
          set_prompt(e.target.value);
          update(true);
        }}
      />
    </>
  );
}

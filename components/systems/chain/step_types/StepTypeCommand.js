import { Select, MenuItem, TextField } from "@mui/material";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../lib/apiClient";
import { mutate } from "swr";
import useSWR from "swr";
import AgentAdmin from "../../agent/tabs/AgentConfigure";
export default function StepTypeCommand({ prompt, set_prompt, update }) {
  const [command, setCommand] = useState(-1);
  const [args, setArgs] = useState("");
  const commands = useSWR("command", async () => await sdk.getCommands(agent));
  useEffect(() => {
    const command = prompt.slice(0, prompt.indexOf("("));
    const args = prompt.slice(prompt.indexOf("(") + 1, prompt.indexOf(")"));
    setCommand(
      commands.data && prompt
        ? commands.data.findIndex(
            (commandFound) => commandFound.name == command
          )
        : -1
    );
    setArgs(args);
  }, [commands.data, prompt]);
  useEffect(() => {
    console.log(commands.data);
    console.log(command);
    if (command && command != -1 && args && commands.data)
      set_prompt(`${commands.data[command].name}(${args})`);
  }, [command, commands, args, set_prompt]);

  return (
    <>
      <Select
        label="Command"
        sx={{ mx: "0.5rem" }}
        value={command}
        onChange={(e) => {
          setCommand(e.target.value);
          update(true);
        }}
      >
        <MenuItem value={-1}>Select a Command...</MenuItem>
        {commands?.data?.map((command, index) => {
          return (
            <MenuItem key={index} value={index}>
              {command.friendly_name}
            </MenuItem>
          );
        })}
      </Select>

      <TextField
        label="Args"
        value={args}
        onChange={(e) => {
          setArgs(e.target.value);
          update(true);
        }}
        sx={{ mx: "0.5rem", flex: 1 }}
      />
    </>
  );
}

import { Select, MenuItem, TextField } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { sdk } from "../../../../lib/apiClient";
import useSWR from "swr";
export default function StepTypeCommand({ prompt, set_prompt, update }) {
  console.log("StepTypeCommand prompt: ", prompt);
  const [command, setCommand] = useState(-1);
  const [args, setArgs] = useState("");
  const commandsList = useSWR(
    "command",
    async () => await sdk.getCommands("gpt4free")
  );
  const commands = commandsList.isLoading ? [] : commandsList.data;
  useEffect(() => {
    const command = prompt.command_name;
    setCommand(
      commands && prompt
        ? commands.findIndex((commandFound) => commandFound.name == command)
        : -1
    );
    console.log(prompt);
    setArgs(prompt);
  }, [commands, prompt]);
  useEffect(() => {
    console.log("StepTypeCommand commands: ", commands);
    console.log("StepTypeCommand command: ", command);
    if (command && command != -1 && args && commands)
      set_prompt(`${commands[command].name}(${args})`);
  }, [command, commands, args, set_prompt]);
  return (
    <>
      {commandsList.isLoading ? (
        "Loading..."
      ) : (
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
          {Object.keys(commands).map((command, index) => {
            return (
              <MenuItem key={index} value={index}>
                {command.name}
              </MenuItem>
            );
          })}
        </Select>
      )}
      {prompt && commands && command != -1
        ? commands[command].args.map((arg, index) => {
            return (
              <TextField
                key={index}
                sx={{ mx: "0.5rem" }}
                label={arg}
                value={args[arg]}
                onChange={(e) => {
                  setArgs({ ...args, [arg]: e.target.value });
                  update(true);
                }}
              />
            );
          })
        : null}
    </>
  );
}

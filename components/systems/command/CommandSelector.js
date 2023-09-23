import {
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import { useSettings } from "../../../lib/SettingsContext";

export default function CommandSelector({
  commandName,
  setCommandName,
  commandArgs,
  setCommandArgs,
  isLoading,
}) {
  const { commands } = useSettings();

  return (
    <>
      <Box display="flex" alignItems="center" gap={2}>
        <FormControl sx={{ mb: 2, width: "30%" }}>
          <InputLabel id="command-label">Select a Command</InputLabel>
          <Select
            labelId="command-label"
            value={commandName}
            onChange={(e) => setCommandName(e.target.value)}
            disabled={isLoading}
          >
            {Object.keys(commands).map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {commandArgs ? (
        Object.keys(commandArgs).map((arg) => {
          if (
            arg !== "conversation_history" &&
            arg !== "context" &&
            arg !== "COMMANDS" &&
            arg !== "command_list" &&
            arg !== "date" &&
            arg !== "agent_name" &&
            arg !== "working_directory" &&
            arg !== "helper_agent_name" &&
            arg !== "command_name" &&
            arg !== ""
          ) {
            return (
              <TextField
                label={arg}
                value={commandArgs[arg]}
                onChange={(e) =>
                  setCommandArgs({ ...commandArgs, [arg]: e.target.value })
                }
                sx={{ mb: 2 }}
                disabled={isLoading}
              />
            );
          }
        })
      ) : (
        <></>
      )}
    </>
  );
}

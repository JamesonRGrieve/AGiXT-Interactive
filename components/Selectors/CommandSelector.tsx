'use client';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import { useContext } from 'react';
import useSWR from 'swr';
import { InteractiveConfigContext } from '../../types/InteractiveConfigContext';

export default function CommandSelector({
  agentName,
  value,
  mutate,
}: {
  agentName: string;
  value: string;
  mutate: (e: string) => void;
}) {
  const context = useContext(InteractiveConfigContext);
  const { data: commandData } = useSWR(
    `/agent/commands?agent=${agentName}`,
    async () => await context.agixt.getCommands(agentName),
  );

  return (
    <FormControl fullWidth>
      <InputLabel id='command-label'>Select a Command</InputLabel>
      <Select
        labelId='command-label'
        value={value}
        onChange={(e) => {
          mutate(e.target.value);
        }}
        disabled={false}
      >
        {commandData
          ? Object.keys(commandData).map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))
          : null}
      </Select>
    </FormControl>
  );
}

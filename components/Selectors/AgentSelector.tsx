'use client';
import { Select, MenuItem, FormControl, Tooltip, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import useSWR from 'swr';
import { InteractiveConfigContext } from '../../types/InteractiveConfigContext';

export default function AgentSelector(): React.JSX.Element {
  const state = useContext(InteractiveConfigContext);
  const { data: agentData } = useSWR<string[]>(`/agent`, async () => (await state.agixt.getAgents()) as string[]);
  const theme = useTheme();

  return (
    <Tooltip title='Select an Agent'>
      <FormControl
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
        fullWidth
        size='small'
      >
        <Select
          sx={{
            color: theme.palette.mode === 'dark' ? 'white' : 'black',
            '.MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.mode === 'dark' ? '#CCC' : '#333' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.mode === 'dark' ? 'white' : 'black' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.mode === 'dark' ? 'white' : 'black',
            },
            '.MuiSvgIcon-root ': {
              fill: (theme.palette.mode === 'dark' ? 'white' : 'black') + ' !important',
            },
            '.MuiOutlinedInput-notchedOutline legend span': {
              // Targeting the floating label specifically
              color: theme.palette.mode === 'dark' ? 'white' : 'black',
              opacity: '1',
            },
            fontSize: '12px',
          }}
          fullWidth
          labelId='agent-label'
          label='Select an Agent'
          disabled={agentData?.length === 0}
          value={state.agent}
          onChange={(e) =>
            state.mutate((oldState) => ({
              ...oldState,
              agent: e.target.value,
            }))
          }
        >
          {agentData &&
            agentData.map &&
            agentData?.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Tooltip>
  );
}

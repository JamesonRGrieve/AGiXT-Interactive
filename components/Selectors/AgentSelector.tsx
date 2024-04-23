'use client';
import { Select, MenuItem, FormControl, Tooltip } from '@mui/material';
import React, { useContext } from 'react';
import useSWR from 'swr';
import { ChatContext } from '../../types/ChatContext';

export default function AgentSelector(): React.JSX.Element {
  const state = useContext(ChatContext);
  const { data: agentData } = useSWR<string[]>(`/agent`, async () => (await state.agixt.getAgents()) as string[]);
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
            color: 'white',
            '.MuiOutlinedInput-notchedOutline': { borderColor: '#CCC' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
            '.MuiSvgIcon-root ': {
              fill: 'white !important',
            },
            '.MuiOutlinedInput-notchedOutline legend span': {
              // Targeting the floating label specifically
              color: 'white',
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

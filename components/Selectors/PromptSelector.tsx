'use client';
import { Select, MenuItem, FormControl, Tooltip } from '@mui/material';
import React, { useContext } from 'react';
import useSWR from 'swr';
import { InteractiveConfigContext } from '../../types/InteractiveConfigContext';

export default function PromptSelector(): React.JSX.Element {
  const state = useContext(InteractiveConfigContext);
  const { data: promptData } = useSWR<string[]>(
    `/prompt`,
    async () => (await state.agixt.getPrompts(state.overrides.promptCategory)) as string[],
  );
  return (
    <Tooltip title='Select a Prompt'>
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
          labelId='conversation-label'
          label='Select a Prompt'
          disabled={promptData?.length === 0}
          value={state.overrides.prompt}
          onChange={(e) =>
            state.mutate((oldState) => ({
              ...oldState,
              prompt: e.target.value,
            }))
          }
        >
          {promptData &&
            promptData.map &&
            promptData?.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Tooltip>
  );
}

'use client';
import { Select, MenuItem, FormControl, Tooltip, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import useSWR from 'swr';
import { InteractiveConfigContext } from '../../types/InteractiveConfigContext';

export default function PromptSelector(): React.JSX.Element {
  const state = useContext(InteractiveConfigContext);
  const { data: promptData } = useSWR<string[]>(
    `/prompt`,
    async () => (await state.agixt.getPrompts(state.overrides.promptCategory)) as string[],
  );
  const theme = useTheme();

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

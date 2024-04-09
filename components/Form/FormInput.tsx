import { Box, TextField } from '@mui/material';
import React, { useMemo } from 'react';
import AgentSelector from '../Selectors/AgentSelector';
import PromptSelector from '../Selectors/PromptSelector';
import ConversationSelector from '../Selectors/ConversationSelector';

export default function FormInput({ argValues, setArgValues, disabled }) {
  return (
    <Box mt='1rem' px='1rem' display='flex' flexDirection='row' gap='1rem' justifyContent='center' alignItems='center'>
      {process.env.NEXT_PUBLIC_AGIXT_SHOW_SELECTION_BAR === 'agent' && <AgentSelector />}
      {process.env.NEXT_PUBLIC_AGIXT_SHOW_SELECTION_BAR === 'prompt' && <PromptSelector />}
      {process.env.NEXT_PUBLIC_AGIXT_SHOW_SELECTION_BAR === 'conversation' && <ConversationSelector />}
      {Object.keys(argValues).map((arg) => {
        const [argType, argName, ...argConfig] = arg.split('_');
        if (argType.toLowerCase() === 'text')
          return (
            <TextField
              variant='outlined'
              disabled={disabled}
              label={argName.replace(/([A-Z])/g, ' $1')}
              key={argName}
              value={argValues[arg]}
              onChange={(event) => {
                setArgValues((previous) => ({ ...previous, [arg]: event.target.value }));
              }}
            />
          );
      })}
    </Box>
  );
}

import { Box, TextField } from '@mui/material';
import React, { ReactNode } from 'react';

export default function FormInput({
  argValues,
  setArgValues,
  disabled,
}: {
  argValues: Record<string, string>;
  setArgValues: (argValues: Record<string, string> | ((previous: Record<string, string>) => Record<string, string>)) => void;
  disabled: boolean;
}): ReactNode {
  return (
    <Box mt='1rem' px='1rem' display='flex' flexDirection='row' gap='1rem' justifyContent='center' alignItems='center'>
      {Object.keys(argValues).map((arg) => {
        const [argType, argName] = arg.split('_');
        if (argType.toLowerCase() === 'text') {
          return (
            <TextField
              fullWidth
              variant='outlined'
              disabled={disabled}
              label={argName.replace(/([A-Z])/g, ' $1')}
              key={argName}
              value={argValues[String(arg)]}
              onChange={(event) => {
                setArgValues((previous) => ({ ...previous, [arg]: event.target.value }));
              }}
            />
          );
        }
      })}
    </Box>
  );
}

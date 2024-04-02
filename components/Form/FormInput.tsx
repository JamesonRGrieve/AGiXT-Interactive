import { Box, TextField } from '@mui/material';
import React, { useContext } from 'react';
export default function FormInput({ argValues, setArgValues, disabled }) {
  return (
    <Box mt='1rem' px='1rem' display='flex' flexDirection='row' gap='1rem' justifyContent='center' alignItems='center'>
      {Object.keys(argValues).map((arg) => (
        <TextField
          variant='outlined'
          disabled={disabled}
          label={arg}
          key={arg}
          value={argValues[arg]}
          onChange={(event) => {
            setArgValues((previous) => ({ ...previous, [arg]: event.target.value }));
          }}
        />
      ))}
    </Box>
  );
}

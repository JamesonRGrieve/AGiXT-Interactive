import { Box, TextField } from '@mui/material';
import { ChatContext } from '../../types/ChatContext';
import React, { useContext } from 'react';
export default function FormInput({ argValues, setArgValues }) {
  return (
    <Box px='1rem' display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
      {Object.keys(argValues).map((arg) => (
        <TextField
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

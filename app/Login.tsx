'use client';
import { setCookie } from 'cookies-next';
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
export default function Login() {
  const [apiKey, setApiKey] = useState('');
  return (
    <Box width='100%' height='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
      <Typography variant='h1'>AGiXT Chat</Typography>
      <Typography variant='body1'>
        Please enter your API key to continue. You can find your API key in the AGiXT portal.
      </Typography>
      <TextField type='text' value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      <Button
        variant='contained'
        onClick={() => {
          setCookie('jwt', apiKey);
          location.reload();
        }}
      >
        Set API Key
      </Button>
    </Box>
  );
}

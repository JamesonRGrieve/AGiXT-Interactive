'use client';
import { setCookie } from 'cookies-next';
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
export default function EnterAPIKey() {
  const [apiKey, setApiKey] = useState('');
  return (
    <Box
      position='absolute'
      top='0'
      right='0'
      bottom='0'
      left='0'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      gap='1rem'
    >
      <Typography variant='h1'>AGiXT Chat</Typography>
      <Typography variant='body1'>
        Please enter your API key to continue. You can find your API key in the AGiXT portal.
      </Typography>
      <TextField type='text' value={apiKey} onChange={(e) => setApiKey(e.target.value)} fullWidth />
      <Button
        variant='contained'
        fullWidth
        onClick={() => {
          setCookie('jwt', apiKey, {
            domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
          });
          location.reload();
        }}
      >
        Set API Key
      </Button>
    </Box>
  );
}

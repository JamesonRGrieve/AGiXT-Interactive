'use client';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import React, { FormEvent, ReactNode, useState } from 'react';
import QRCode from 'react-qr-code';
export default function Login({ searchParams }: { searchParams: any }): ReactNode {
  const [responseMessage, setResponseMessage] = useState('');
  const submitForm = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData((event.currentTarget as HTMLFormElement) ?? undefined));
    try {
      setResponseMessage(
        (
          await axios
            .post(`${process.env.NEXT_PUBLIC_AGIXT_SERVER}/v1/login`, {
              ...formData,
              referrer: getCookie('href') ?? '',
            })
            .catch((exception: any) => exception.response)
        ).data.detail,
      );
    } catch (exception) {
      console.error(exception);
    }
  };
  const otp_uri = searchParams.otp_uri;
  return (
    <Box component='form' onSubmit={submitForm} display='flex' flexDirection='column' gap='1rem'>
      {otp_uri && !responseMessage && (
        <Box sx={{ backgroundColor: '#fff', padding: '0.5rem' }}>
          <QRCode
            size={256}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            value={otp_uri ?? ''}
            viewBox={`0 0 256 256`}
          />
        </Box>
      )}
      <input type='hidden' id='email' name='email' value={getCookie('email')} />
      <TextField id='token' label='Multifactor Code' variant='outlined' name='token' />
      {responseMessage && <Typography>{responseMessage}</Typography>}
      <Button type='submit'>{responseMessage ? 'Continue' : 'Login'}</Button>
    </Box>
  );
}

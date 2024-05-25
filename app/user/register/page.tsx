'use client';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { FormEvent, ReactNode, useState } from 'react';
const ehrs = {
  pointclickcare: 'PointClickCare',
};
export default function Register(): ReactNode {
  const router = useRouter();
  const [responseMessage, setResponseMessage] = useState('');

  const submitForm = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData((event.currentTarget as HTMLFormElement) ?? undefined));
    const registerResponse = (
      await axios
        .post(`${process.env.NEXT_PUBLIC_AGIXT_SERVER}/v1/user`, {
          ...formData,
        })
        .catch((exception: any) => exception.response)
    ).data;
    setResponseMessage(registerResponse.detail);
    if (registerResponse.otp_uri) {
      router.push(`/user/login?otp_uri=${registerResponse.otp_uri}`);
    }
  };

  return (
    <Box component='form' onSubmit={submitForm} display='flex' flexDirection='column' gap='1rem'>
      <input type='hidden' id='email' name='email' value={getCookie('email')} />
      <TextField id='first_name' label='First Name' variant='outlined' name='first_name' />
      <TextField id='last_name' label='Last Name' variant='outlined' name='last_name' />
      {process.env.NEXT_PUBLIC_SELECTED_EHR && (
        <>
          <TextField
            id='username'
            label={`${ehrs[(process.env.NEXT_PUBLIC_SELECTED_EHR ?? '') as keyof typeof ehrs]} Username`}
            variant='outlined'
            name='username'
          />
          <TextField
            id='password'
            label={`${ehrs[(process.env.NEXT_PUBLIC_SELECTED_EHR ?? '') as keyof typeof ehrs]} Password`}
            variant='outlined'
            name='password'
            type='password'
          />
        </>
      )}
      <Button type='submit'>Register</Button>
      {responseMessage && <Typography>{responseMessage}</Typography>}
    </Box>
  );
}

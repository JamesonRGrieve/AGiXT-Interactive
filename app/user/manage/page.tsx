'use client';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import React, { FormEvent, ReactNode, useState } from 'react';
import useSWR, { mutate } from 'swr';

export default function Manage(): ReactNode {
  const integration = getCookie('integration');
  const [responseMessage, setResponseMessage] = useState('');
  const submitForm = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData((event.currentTarget as HTMLFormElement) ?? undefined));
    const updateResponse = (
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_AGIXT_SERVER}/v1/user`,
          {
            ...formData,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: getCookie('jwt'),
            },
          },
        )
        .catch((exception: any) => exception.response)
    ).data;
    setResponseMessage(updateResponse.detail);
    mutate('/user');
  };
  type User = {
    first_name: string;
    last_name: string;
    username?: string;
  };

  const { data, isLoading } = useSWR<User, any, '/user'>('/user', async () => {
    return (
      await axios.get(`${process.env.NEXT_PUBLIC_AGIXT_SERVER}/v1/user`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getCookie('jwt'),
        },
      })
    ).data;
  });
  return isLoading ? (
    <Typography>Loading Current Data...</Typography>
  ) : (
    <Box component='form' onSubmit={submitForm} display='flex' flexDirection='column' gap='1rem'>
      <input type='hidden' id='email' name='email' value={getCookie('email')} />
      <TextField id='first_name' label='First Name' variant='outlined' name='first_name' defaultValue={data?.first_name} />
      <TextField id='last_name' label='Last Name' variant='outlined' name='last_name' defaultValue={data?.last_name} />
      {integration && (
        <>
          <TextField
            id='username'
            label={`${integration} Username`}
            variant='outlined'
            name='username'
            defaultValue={data?.username}
          />
          <TextField
            id='password'
            label={`${integration} Password`}
            variant='outlined'
            name='password'
            type='password'
            placeholder='Password1'
          />
        </>
      )}
      <Button type='submit'>Update User</Button>
      {responseMessage && <Typography>{responseMessage}</Typography>}
    </Box>
  );
}

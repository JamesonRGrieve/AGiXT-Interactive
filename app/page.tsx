import React from 'react';
import AGiXTChat from '../components/InteractiveAGiXT';
import { cookies } from 'next/headers';
import Login from './Login';
import ConversationSelector from '../components/ConversationSelector';
import AppWrapper from 'jrgcomponents/AppWrapper/Wrapper';
import { Box, Typography } from '@mui/material';
export default function Home() {
  const cookieStore = cookies();
  const apiKey = process.env.NEXT_PUBLIC_AGIXT_API_KEY ?? cookieStore.get('jwt')?.value ?? '';
  // console.log('Server-Side API Key: ', apiKey);
  return process.env.NEXT_PUBLIC_AGIXT_REQUIRE_API_KEY === 'true' && !apiKey ? <Login /> : <AGiXTChat />;
}

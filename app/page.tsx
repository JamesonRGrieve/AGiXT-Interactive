import React from 'react';
import AGiXTChat from '../components/InteractiveAGiXT';
import { cookies } from 'next/headers';
import Login from './Login';
import ConversationSelector from '../components/ConversationSelector';
import AppWrapper from 'jrgcomponents/AppWrapper/Wrapper';
import { Typography } from '@mui/material';
export default function Home() {
  const cookieStore = cookies();
  const apiKey =
    process.env.NEXT_PUBLIC_AGIXT_API_KEY ?? cookieStore.get('apiKey')?.value ?? cookieStore.get('jwt')?.value ?? '';
  console.log('Server-Side API Key: ', apiKey);
  return process.env.NEXT_PUBLIC_AGIXT_REQUIRE_API_KEY === 'true' && !apiKey ? (
    <Login />
  ) : (
    <AppWrapper
      header={
        process.env.NEXT_PUBLIC_AGIXT_SHOW_APP_BAR === 'true' && {
          components: {
            left:
              process.env.NEXT_PUBLIC_AGIXT_SHOW_CONVERSATION_BAR === 'true' ? (
                <ConversationSelector />
              ) : (
                <span>&nbsp;</span>
              ),
          },
        }
      }
      footer={
        process.env.NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE && {
          components: {
            center: (
              <Typography sx={{ margin: 0 }} variant='caption' textAlign='center'>
                {process.env.NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE}
              </Typography>
            ),
          },
        }
      }
    >
      <AGiXTChat />
    </AppWrapper>
  );
}

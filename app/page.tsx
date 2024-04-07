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
  // console.log('API Key: ', apiKey);
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
      <AGiXTChat
        uiConfig={{
          showAppBar: process.env.NEXT_PUBLIC_AGIXT_SHOW_APP_BAR === 'true', // Show the conversation selection bar to create, delete, and export conversations
          showConversationSelector: process.env.NEXT_PUBLIC_AGIXT_SHOW_CONVERSATION_BAR === 'true', // Show the conversation selection bar to create, delete, and export conversations
          showRLHF: process.env.NEXT_PUBLIC_AGIXT_RLHF === 'true',
          showChatThemeToggles: process.env.NEXT_PUBLIC_AGIXT_SHOW_CHAT_THEME_TOGGLES === 'true',
          footerMessage: process.env.NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE || 'Powered by AGiXT',
          alternateBackground: 'primary',
        }}
        chatConfig={{
          mode: (process.env.NEXT_PUBLIC_AGIXT_MODE && ['chain', 'prompt'].includes(process.env.NEXT_PUBLIC_AGIXT_MODE)
            ? process.env.NEXT_PUBLIC_AGIXT_MODE
            : 'prompt') as 'chain' | 'prompt',
        }}
        serverConfig={{
          apiKey: apiKey,
          agixtServer: process.env.NEXT_PUBLIC_AGIXT_SERVER ?? '',
        }}
      />
    </AppWrapper>
  );
}

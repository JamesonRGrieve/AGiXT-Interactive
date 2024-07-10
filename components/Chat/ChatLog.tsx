'use client';
import React, { useEffect, useRef } from 'react';
import { Paper, Box, Typography, useTheme } from '@mui/material';
import ChatActivity from './Message/Activity';
import Message from './Message/Message';
export default function ChatLog({
  conversation,
  alternateBackground,
  showRLHF,
  loading,
  enableMessageDeletion,
  enableMessageEditing,
  setLoading,
}: {
  conversation: { role: string; message: string; timestamp: string; children: any[] }[];
  setLoading: (loading: boolean) => void;
  loading: boolean;
  showRLHF: boolean;
  enableMessageEditing: boolean;
  enableMessageDeletion: boolean;
  alternateBackground?: string;
}): React.JSX.Element {
  let lastUserMessage = ''; // track the last user message
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  console.log(conversation);
  useEffect(() => {
    // console.log('Conversation mutated, scrolling to bottom.', state.overrides.conversation, conversation);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  return (
    <Paper
      elevation={5}
      sx={{
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: '1 1 0',
        flexGrow: '1',
        backgroundColor: theme.palette.background.default,
        overflow: 'auto',
      }}
    >
      <Box display='flex' minHeight='min-content' flexDirection='column'>
        {conversation.length > 0 && conversation.map ? (
          conversation.map((chatItem, index: number) => {
            if (chatItem.role === 'USER') {
              lastUserMessage = chatItem.message;
            }
            const validTypes = ['[ACTIVITY]', '[ACTIVITY][ERROR]', '[ACTIVITY][WARN]', '[ACTIVITY][INFO]'];
            const messageType = chatItem.message.split(' ')[0];
            const messageBody = validTypes.includes(messageType)
              ? chatItem.message.substring(chatItem.message.indexOf(' '))
              : chatItem.message;
            // TODO Fix this so the timestamp works. It's not granular enough rn and we get duplicates.
            return validTypes.includes(messageType) ? (
              <ChatActivity
                key={chatItem.timestamp + '-' + messageBody}
                severity={
                  messageType === '[ACTIVITY]'
                    ? 'success'
                    : (messageType.split('[')[2].split(']')[0].toLowerCase() as 'error' | 'info' | 'success' | 'warn')
                }
                inProgress={
                  loading && ['[ACTIVITY]', '[SUBACTIVITY]'].includes(messageType) && index === conversation.length - 1
                }
                message={messageBody}
                timestamp={chatItem.timestamp}
                alternateBackground={alternateBackground}
                children={chatItem.children}
              />
            ) : (
              <Message
                key={chatItem.timestamp + '-' + messageBody}
                chatItem={chatItem}
                lastUserMessage={lastUserMessage}
                setLoading={setLoading}
                alternateBackground={alternateBackground}
                rlhf={showRLHF}
                enableMessageDeletion={enableMessageDeletion}
                enableMessageEditing={enableMessageEditing}
              />
            );
          })
        ) : (
          <Box pt='2rem' pb='3rem'>
            <Typography variant='h1' align='center'>
              Welcome {process.env.NEXT_PUBLIC_APP_NAME && `to ${process.env.NEXT_PUBLIC_APP_NAME}`}
            </Typography>
            {process.env.NEXT_PUBLIC_APP_DESCRIPTION && (
              <Typography variant='subtitle1' align='center' mb='2rem'>
                {process.env.NEXT_PUBLIC_APP_DESCRIPTION}
              </Typography>
            )}
            <Typography variant='body1' align='center' px='2rem'>
              {process.env.NEXT_PUBLIC_APP_NAME || 'This software'} may provide inaccurate or inappropriate responses, may
              break character and comes with no warranty of any kind. By using this software you agree to hold harmless the
              developers of {process.env.NEXT_PUBLIC_APP_NAME || 'this software'} for any damages caused by the use of this
              software.
            </Typography>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>
    </Paper>
  );
}

'use client';
import ConversationHistory from './conversation/ConversationLog';
import ConversationBar from './conversation/ConversationBar';
import Box from '@mui/material/Box';
import Header from './Header';
import { ChatProps } from './AGiXTChat';
import { useTheme } from '@mui/material';
import { AGiXTChatDefaultState } from '@/types/AGiXTChatState';
import AGiXTChatWrapper from './AGiXTChatWrapper';
import { getCookie } from 'cookies-next';

export default function Chat({ mode, showAppBar, showConversationSelector, opts }: ChatProps) {
  const theme = useTheme();
  return (
    <AGiXTChatWrapper
    initialState={{
      chatConfig: {
        ...AGiXTChatDefaultState.chatConfig,
        selectedAgent: opts.agentName || process.env.NEXT_PUBLIC_AGIXT_AGENT,
        conversationName: opts.conversationName || getCookie('uuid')
      }
    }}
  >
    <Box height='100%' display='flex' flexDirection='column'>
      {showAppBar && <Header showConversationSelector={showConversationSelector} />}

      <Box
        style={{
          height: '100%',
          maxWidth: '100%',
          flexGrow: '1',
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          }),
          display: 'flex',
          flexDirection: 'column'
        }}
        component='main'
      >
        <ConversationHistory />
        <ConversationBar mode={mode} />
      </Box>
    </Box>
    </AGiXTChatWrapper>
  );
}

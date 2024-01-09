import { AppBar, Box, Theme, Typography } from '@mui/material';
import SwitchColorblind from 'jrgcomponents/theming/SwitchColorblind';
import SwitchDark from 'jrgcomponents/theming/SwitchDark';
import ConversationSelector from './conversation/ConversationSelector';
import { useContext } from 'react';
import { ChatContext } from '../types/ChatState';

export default function Header({ showConversationSelector }: { showConversationSelector: boolean }) {
  showConversationSelector = true;
  const state = useContext(ChatContext);
  return (
    <AppBar
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'static',
        padding: '0.75rem',
        backgroundColor: 'primary.dark'
      }}>
      <Box display='flex' flex='1' flexDirection='row'>
        <Box display='flex' flexDirection='row' width='100%' pr='4rem'>
          {showConversationSelector ? <ConversationSelector /> : <span>&nbsp;</span>}
        </Box>
      </Box>
      <Typography variant='h1' sx={{ justifySelf: 'center', color: 'white' }}>
        {process.env.NEXT_PUBLIC_APP_NAME} Chat
      </Typography>
      <Box flex='1'>
        <Box display='flex' justifyContent='end'>
          <SwitchDark />
          <SwitchColorblind />
        </Box>
      </Box>
    </AppBar>
  );
}

import ConversationHistory from './conversation/ConversationLog';
import ConversationBar from './conversation/ConversationBar';
import Box from '@mui/material/Box';
import { AGiXTContext } from 'agixt-react';
import Header from './Header';

import { AGiXTState } from 'agixt-react';
import { ChatProps } from './AGiXTChat';
import { useTheme } from '@mui/material';
import { useContext } from 'react';

export default function Chat({ mode, showAppBar, showConversationSelector }: ChatProps & { state: AGiXTState }) {
  const theme = useTheme();
  const state = useContext(AGiXTContext);
  return (
    <Box height='100%' display='flex' flexDirection='column'>
      {showAppBar && <Header />}

      <Box
        style={{
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
  );
}

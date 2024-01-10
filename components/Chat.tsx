import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import ConversationHistory from './conversation/ConversationLog';
import ConversationBar from './conversation/ConversationBar';
import Header from './Header';
import { ChatProps } from './AGiXTChat';

export default function Chat({ mode, showAppBar, showConversationSelector, opts }: ChatProps) {
  const theme = useTheme();

  return (
    <Box height='100%' display='flex' flexDirection='column'>
      {showAppBar && <Header showConversationSelector={showConversationSelector} />}

      <Box
        style={{
          height: '100%',
          maxWidth: '100%',
          flexGrow: '1',
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          display: 'flex',
          flexDirection: 'column',
        }}
        component='main'
      >
        <ConversationHistory />
        <ConversationBar mode={mode} />
      </Box>
    </Box>
  );
}

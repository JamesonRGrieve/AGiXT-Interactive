import ConversationHistory from './conversation/ConversationLog';
import ConversationBar from './conversation/ConversationBar';
import Box from '@mui/material/Box';

import Header from './Header';

import { AGiXTState } from '../types/AGiXTState';
import { ChatProps } from './AGiXTChat';

export default function Chat({
  state,
  mode,
  showAppBar,
  showConversationSelector,
  theme
}: ChatProps & { state: AGiXTState }) {
  return (
    <Box height='100%' display='flex' flexDirection='column'>
      {showAppBar && <Header state={state} theme={theme} showConversationSelector={showConversationSelector} />}

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
        component='main'>
        <ConversationHistory state={state} theme={theme} />
        <ConversationBar state={state} theme={theme} mode={mode} />
      </Box>
    </Box>
  );
}

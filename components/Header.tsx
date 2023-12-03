import { AppBar, Box, Typography } from '@mui/material';
import SwitchColorblind from 'jrgcomponents/theming/SwitchColorblind';
import SwitchDark from 'jrgcomponents/theming/SwitchDark';
import ConversationSelector from './conversation/ConversationSelector';
import { AGiXTState } from '@/types/AGiXTState';

export default function Header({
  state,
  showConversationSelector
}: {
  state: AGiXTState;
  showConversationSelector: boolean;
}) {
  showConversationSelector = true;
  return (
    <AppBar
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'static',
        padding: '0.75rem'
      }}
    >
      <Box display='flex' flex='1' flexDirection='row'>
        <Box display='flex' flexDirection='row'>
          {showConversationSelector ? <ConversationSelector state={state} /> : <span>&nbsp;</span>}
        </Box>
      </Box>
      <Typography variant='h1' sx={{ justifySelf: 'center' }}>
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

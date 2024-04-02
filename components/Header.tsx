import { AppBar, Box, Typography } from '@mui/material';
import SwitchColorblind from 'jrgcomponents/Theming/SwitchColorblind';
import SwitchDark from 'jrgcomponents/Theming/SwitchDark';
import ConversationSelector from './ConversationSelector';

export default function Header({ showConversationSelector }: { showConversationSelector: boolean }): React.JSX.Element {
  return (
    <AppBar
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'static',
        padding: '0.75rem',
        backgroundColor: 'primary.dark',
      }}
    >
      <Box display='flex' flex='1' flexDirection='row'>
        <Box display='flex' flexDirection='row' width='100%' pr='4rem'>
          {showConversationSelector ? <ConversationSelector /> : <span>&nbsp;</span>}
        </Box>
      </Box>
      <Typography variant='h1' sx={{ justifySelf: 'center', color: 'white' }}>
        {process.env.NEXT_PUBLIC_APP_NAME} {process.env.NEXT_PUBLIC_INTERACTIVE_MODE === 'form' ? 'Form' : 'Chat'}
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

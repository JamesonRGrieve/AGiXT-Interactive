import { AppBar, Box } from '@mui/material';
import SwitchColorblind from 'jrgcomponents/theming/SwitchColorblind';
import SwitchDark from 'jrgcomponents/theming/SwitchDark';
import ConversationSelector from './conversation/ConversationSelector';

export default function Header({ showConversationSelector }: { showConversationSelector: boolean }) {
  showConversationSelector = true;
  return (
    <AppBar
      sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', position: 'static', padding: '0.75rem' }}
    >
      <Box display='flex' flexDirection='row'>
        {showConversationSelector ? <ConversationSelector /> : <span>&nbsp;</span>}
      </Box>
      <Box>
        <SwitchDark />
        <SwitchColorblind />
      </Box>
    </AppBar>
  );
}

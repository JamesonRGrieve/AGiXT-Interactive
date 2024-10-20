import AGiXTInteractive from '@agixt/interactive';
import { cookies } from 'next/headers';

export default function Home() {
  const cookieStore = cookies();
  const apiKey = cookieStore.get('jwt')?.value ?? '';

  return (
    <AGiXTInteractive
      uiConfig={{
        showAppBar: false,
        showChatThemeToggles: false,
        enableVoiceInput: true,
        showRLHF: false,
        footerMessage: '',
        alternateBackground: 'primary',
        showOverrideSwitchesCSV: '',
      }}
      serverConfig={{
        agixtServer: process.env.NEXT_PUBLIC_AGIXT_SERVER || '',
        apiKey,
      }}
      agent='XT'
      overrides={{
        conversation: new Date().toISOString().split('T')[0],
      }}
    />
  );
}

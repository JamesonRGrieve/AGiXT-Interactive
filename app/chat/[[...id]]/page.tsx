import { cookies } from 'next/headers';
import AGiXTInteractive from '@/components/interactive/InteractiveAGiXT';
import { useEffect } from 'react';
import ConvSwitch from './ConvSwitch';

export default function Home({ params }: { params: { id: string } }) {
  return (
    <>
      <ConvSwitch id={params.id} />
      <AGiXTInteractive
        stateful={false}
        uiConfig={{
          showAppBar: false,
          showChatThemeToggles: false,
          enableVoiceInput: true,
          footerMessage: '',
          alternateBackground: 'primary',
        }}
        serverConfig={{
          agixtServer: process.env.NEXT_PUBLIC_AGIXT_SERVER as string,
          apiKey: cookies().get('jwt')?.value ?? '',
        }}
        agent={process.env.NEXT_PUBLIC_AGIXT_AGENT || 'XT'}
        overrides={{
          conversation: params.id,
        }}
      />
    </>
  );
}

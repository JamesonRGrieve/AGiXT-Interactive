import { AGiXTDefaultState, AGiXTState } from '../types/AGiXTState';
import { Theme, useTheme } from '@mui/material';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import AGiXTSDK from 'agixt';
import Chat from './Chat';
export type ChatProps = {
  mode: 'prompt' | 'chain';
  showAppBar?: boolean;
  showConversationSelector?: boolean;
  theme?: Theme;
};
const Stateful = (props: ChatProps) => {
  const [AGiXTState, setAGiXTState] = useState<AGiXTState>({
    // Default state and initializes the SDK
    ...AGiXTDefaultState,
    agent: {
      ...AGiXTDefaultState.agent,
      name: process.env.NEXT_PUBLIC_AGIXT_AGENT
    },
    prompt: {
      ...AGiXTDefaultState.prompt,
      name: process.env.NEXT_PUBLIC_AGIXT_PROMPT_NAME,
      category: process.env.NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY
    },
    sdk: new AGiXTSDK({
      baseUri: process.env.NEXT_PUBLIC_AGIXT_SERVER || 'http://localhost:7437',
      apiKey: process.env.NEXT_PUBLIC_API_KEY || ''
    }),
    mutate: null
  });
  return <Chat {...props} state={{ ...AGiXTState, mutate: setAGiXTState }} />;
};
const Stateless = ({ state, mode, showAppBar, showConversationSelector, theme }: ChatProps & { state: AGiXTState }) => {
  return (
    <Chat
      state={state}
      mode={mode}
      showAppBar={showAppBar}
      showConversationSelector={showConversationSelector}
      theme={theme}
    />
  );
};
const AGiXTChat = ({
  state,
  mode,
  showAppBar = false,
  showConversationSelector = false,
  theme
}: ChatProps & { state?: AGiXTState }) =>
  state ? (
    <Stateless
      state={state}
      mode={mode}
      showAppBar={showAppBar}
      showConversationSelector={showConversationSelector}
      theme={theme}
    />
  ) : (
    <Stateful mode={mode} showAppBar={showAppBar} showConversationSelector={showConversationSelector} theme={theme} />
  );
export default AGiXTChat;

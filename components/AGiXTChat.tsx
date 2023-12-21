import { AGiXTDefaultState, AGiXTWrapper } from 'agixt-react';
import { getCookie } from 'cookies-next';
import Chat from './Chat';
export type ChatProps = {
  mode: 'prompt' | 'chain';
  showAppBar?: boolean;
  showConversationSelector?: boolean;
};
const Stateful = (props: ChatProps) => {
  return (
    <AGiXTWrapper
      requireKey={process.env.NEXT_PUBLIC_AGIXT_REQUIRE_API_KEY === 'true'}
      apiKey={process.env.NEXT_PUBLIC_API_KEY || ''}
      agixtServer={process.env.NEXT_PUBLIC_AGIXT_SERVER || 'http://localhost:7437'}
      initialState={{
        agent: {
          ...AGiXTDefaultState.agent,
          name: process.env.NEXT_PUBLIC_AGIXT_AGENT
        },
        prompt: {
          ...AGiXTDefaultState.prompt,
          name: process.env.NEXT_PUBLIC_AGIXT_PROMPT_NAME,
          category: process.env.NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY
        },
        chatConfig: {
          ...AGiXTDefaultState.chatConfig,
          conversationName: getCookie('uuid')
        }
      }}
    >
      <Chat {...props} />
    </AGiXTWrapper>
  );
};
const Stateless = (props: ChatProps) => {
  return <Chat {...props} />;
};
const AGiXTChat = ({
  stateful = true,
  mode,
  showAppBar = false,
  showConversationSelector = false
}: ChatProps & { stateful?: boolean }) => {
  console.log(
    `AGiXTChat initialized as ${stateful ? '' : 'not '}stateful. ${
      stateful
        ? 'AGiXTChat will provide its own AGiXTWrapper and state.'
        : 'Assuming an AGiXTWrapper encloses this instance.'
    }`
  );
  return stateful ? (
    <Stateful mode={mode} showAppBar={showAppBar} showConversationSelector={showConversationSelector} />
  ) : (
    <Stateless mode={mode} showAppBar={showAppBar} showConversationSelector={showConversationSelector} />
  );
};
export default AGiXTChat;

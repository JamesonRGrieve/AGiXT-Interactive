import { ChatDefaultConfig } from '../types/ChatContext';
import ContextWrapper from './ContextWrapper';
import Chat from './Chat';

export type ChatProps = {
  mode: 'prompt' | 'chain';
  showAppBar?: boolean;
  showConversationSelector?: boolean;
  opts?: {
    agixtServer?: string;
    apiKey?: string;
    agentName?: string;
    promptName?: string;
    promptCategory?: string;
    conversationName?: string;
  };
};
const Stateful = (props: ChatProps) => {
  return (
    <ContextWrapper
      requireKey={process.env.NEXT_PUBLIC_AGIXT_REQUIRE_API_KEY === 'true'}
      apiKey={props.opts?.apiKey || process.env.NEXT_PUBLIC_API_KEY || ''}
      agixtServer={props.opts?.agixtServer || process.env.NEXT_PUBLIC_AGIXT_SERVER || 'http://localhost:7437'}
      initialState={{
        ...ChatDefaultConfig,
        chatSettings: {
          ...ChatDefaultConfig.chatSettings,
          selectedAgent: props.opts?.agentName || process.env.NEXT_PUBLIC_AGIXT_AGENT_NAME,
        },
        prompt: props.opts?.promptName || process.env.NEXT_PUBLIC_AGIXT_PROMPT_NAME,
        promptCategory: props.opts?.promptCategory || process.env.NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY,
      }}
    >
      <Chat {...props} />
    </ContextWrapper>
  );
};
const Stateless = (props: ChatProps) => {
  return <Chat {...props} />;
};
const AGiXTChat = ({
  stateful = true,
  mode,
  showAppBar = false,
  showConversationSelector = false,
  opts,
}: ChatProps & { stateful?: boolean }) => {
  console.log(
    `AGiXTChat initialized as ${stateful ? '' : 'not '}stateful. ${
      stateful
        ? 'AGiXTChat will provide its own ChatContext Provider and state.'
        : 'Assuming a ChatContext Provider encloses this instance.'
    }`,
  );
  return stateful ? (
    <Stateful mode={mode} showAppBar={showAppBar} showConversationSelector={showConversationSelector} opts={opts} />
  ) : (
    <Stateless mode={mode} showAppBar={showAppBar} showConversationSelector={showConversationSelector} />
  );
};
export default AGiXTChat;

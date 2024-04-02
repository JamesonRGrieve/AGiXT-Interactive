import { useContext, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { ChatProps, UIProps } from '../AGiXTChat';
import { ChatContext } from '../../types/ChatContext';
import ConversationBar from '../Chat/ChatBar/ConversationBar';
import FormInput from './FormInput';
import FormOutput from './FormOutput';

export default function Form({ mode, showChatThemeToggles }: ChatProps & UIProps): React.JSX.Element {
  const state = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState('');
  const [uuids, setUUIDs] = useState([]);
  const results = useSWR(
    '/results',
    async () => Promise.all(uuids.map(async (uuid) => await state.sdk.getConversation('', uuid, 5, 1))),
    {
      fallbackData: [],
    },
  );
  const { data: promptArgs } = useSWR('/prompt/args', async () => await state.sdk.getPromptArgs(state.prompt), {
    fallbackData: [],
  });
  const [argValues, setArgValues] = useState({});
  useEffect(() => {
    setArgValues(promptArgs.reduce((obj, key) => ({ ...obj, [key]: '' }), {}));
  }, promptArgs);
  return (
    <>
      <FormInput argValues={argValues} setArgValues={setArgValues} />
      <ConversationBar
        setLatestMessage={setLatestMessage}
        latestMessage={latestMessage}
        mode={mode}
        showChatThemeToggles={showChatThemeToggles}
      />
      <FormOutput results={results} />
    </>
  );
}

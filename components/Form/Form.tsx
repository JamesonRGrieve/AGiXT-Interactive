import { useContext, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Alert } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { ChatProps, UIProps } from '../InteractiveAGiXT';
import { ChatContext } from '../../types/ChatContext';
import ConversationBar from '../Chat/ChatBar';
import FormInput from './FormInput';
import FormOutput from './FormOutput';

export default function Form({ mode, showChatThemeToggles }: ChatProps & UIProps): React.JSX.Element {
  const state = useContext(ChatContext);
  const [argValues, setArgValues] = useState({});
  const [uuids, setUUIDs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: results } = useSWR(
    '/results',
    async () => await Promise.all(uuids.map(async (uuid) => (await state.sdk.getConversation('', uuid, 5, 1))[1].message)),
    {
      fallbackData: [],
    },
  );
  const { data: promptArgs } = useSWR(
    '/prompt/args',
    async () => (await state.sdk.getPromptArgs(state.prompt)).filter((arg) => arg !== 'user_input'),
    {
      fallbackData: [],
    },
  );
  useEffect(() => {
    mutate('/results');
  }, [uuids]);

  useEffect(() => {
    if (promptArgs.length > 0) {
      setArgValues(promptArgs.reduce((obj, key) => ({ ...obj, [key]: '' }), {}));
    }
  }, [promptArgs]);
  async function submit(message, files) {
    const messages = [];
    if (files.length > 0) {
      const fileContents = await Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (event) {
              const base64Content = Buffer.from(event.target.result as string, 'binary').toString('base64');
              resolve({
                type: `${file.type.split('/')[0]}_url`,
                [`${file.type.split('/')[0]}_url`]: {
                  url: `data:${file.type};base64,${base64Content}`,
                },
              });
            };
            reader.onerror = reject;
            reader.readAsBinaryString(file);
          });
        }),
      );
      messages.push({
        role: 'user',
        content: [{ type: 'text', text: message }, ...fileContents],
        prompt_args: { ...argValues },
      });
    } else {
      messages.push({ role: 'user', content: message, prompt_args: { ...argValues } });
    }
    const uuid = uuidv4();
    const toOpenAI = {
      messages: messages,
      model: state.chatSettings.selectedAgent,
      user: uuid,
    };
    setLoading(true);
    console.log('Sending: ', toOpenAI);
    const chatCompletion = await state.openai.chat.completions.create(toOpenAI);
    setLoading(false);
    setUUIDs((previous) => [...previous, uuid]);
    if (chatCompletion?.choices[0]?.message.content.length > 0) {
      return chatCompletion.choices[0].message.content;
    } else {
      return 'Unable to get response from the agent';
    }
  }
  return (
    <>
      <FormInput disabled={loading} argValues={argValues} setArgValues={setArgValues} />

      <ConversationBar
        onSend={(message, files) => submit(message, files)}
        disabled={loading}
        mode={mode}
        showChatThemeToggles={showChatThemeToggles}
      />
      {loading && (
        <Alert sx={{ my: '1rem' }} severity='info'>
          Fetching response...
        </Alert>
      )}
      <FormOutput results={results} />
    </>
  );
}

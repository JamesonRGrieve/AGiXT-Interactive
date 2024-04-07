import { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Mic as MicIcon, Cancel as CancelIcon, Send as SendIcon } from '@mui/icons-material';
import { ChatContext } from '../../types/ChatContext';

export default function AudioRecorder({ recording, setRecording, disabled, mode, onSend }: any): React.JSX.Element {
  const state = useContext(ChatContext);
  const [audioData, setAudioData] = useState(null);
  const mediaRecorder = useRef(null);
  const startRecording = (): void => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => {
          setAudioData(event.data);
        };
        mediaRecorder.current.start();
        setRecording(true);
      })
      .catch(() => {
        // console.log(error);
      });
  };

  const finishRecording = (): void => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };
  // const runAudioCommand = async (base64Audio) => {
  //   // const args = { ...state.commandArgs };
  //   // console.log('Command Args:', args);
  //   // console.log('Command Agent:', state.chatSettings.selectedAgent);
  //   // console.log('Command:', state.command);
  //   // console.log('Command Message Arg:', state.commandMessageArg);
  //   const requestArgs = {
  //     base64_audio: base64Audio,
  //     audio_format: 'webm',
  //     audio_variable: state.commandMessageArg,
  //     command_name: state.command,
  //     command_args: {
  //       conversation_results: state.chatSettings.conversationResults,
  //       context_results: state.chatSettings.contextResults,
  //     },
  //   };
  //   console.log(requestArgs);
  //   return await state.sdk.executeCommand(
  //     state.chatSettings.selectedAgent,
  //     'Command with Voice',
  //     requestArgs,
  //     state.chatSettings.conversationName,
  //   );
  // };
  // const runAudioPrompt = async (base64Audio) => {
  //   // console.log('Prompt Category and Prompt: ', state.promptCategory, state.prompt);
  //   const args: any = state.sdk.getPromptArgs(state.prompt, state.promptCategory);
  //   const promptName = state.prompt;
  //   const skipArgs = [
  //     'conversation_history',
  //     'context',
  //     'COMMANDS',
  //     'command_list',
  //     'date',
  //     'agent_name',
  //     'working_directory',
  //     'helper_agent_name',
  //     'prompt_name',
  //     'context_results',
  //     'conversation_results',
  //     'conversation_name',
  //     'prompt_category',
  //     'websearch',
  //     'websearch_depth',
  //     'enable_memory',
  //     'inject_memories_from_collection_number',
  //     'context_results',
  //     'persona',
  //     '',
  //   ];
  //   for (const arg of skipArgs) {
  //     delete args[arg];
  //   }
  //   const stateArgs = {
  //     prompt_category: state.promptCategory,
  //     conversation_name: state.chatSettings.conversationName,
  //     context_results: state.chatSettings.contextResults,
  //     shots: state.chatSettings.shots,
  //     browse_links: state.chatSettings.browseLinks,
  //     websearch: state.chatSettings.webSearch,
  //     websearch_depth: state.chatSettings.websearchDepth,
  //     disable_memory: !state.chatSettings.enableMemory,
  //     inject_memories_from_collection_number: state.chatSettings.injectMemoriesFromCollectionNumber,
  //     conversation_results: state.chatSettings.conversationResults,
  //     ...args,
  //   };
  //   // console.log('---Sending Message---\nState args:\n', stateArgs, '\nState:\n', state, '\nPrompt name:\n', promptName);
  //   return await state.sdk.executeCommand(
  //     state.chatSettings.selectedAgent,
  //     'Prompt with Voice',
  //     {
  //       prompt_name: promptName,
  //       audio_format: 'webm',
  //       base64_audio: base64Audio,
  //       prompt_args: stateArgs,
  //     },
  //     state.chatSettings.conversationName,
  //   );
  // };

  const sendAudio = useCallback(() => {
    if (audioData) {
      const reader = new FileReader();
      reader.readAsDataURL(audioData); // Use readAsDataURL for base64 conversion
      reader.onloadend = (): any => {
        const base64Audio = reader.result as string; // Format looks like: data:audio/webm;codecs=opus;base64,GkXfo59ChoEBQveBAU...
        const response = {
          type: 'audio_url',
          audio_url: {
            url: base64Audio,
          },
        };

        setAudioData(null);
        return onSend(response);
      };
    }
  }, [audioData, onSend]);

  useEffect(() => {
    if (audioData) {
      // console.log('Audio: ', audioData);
      sendAudio();
    }
  }, [audioData, sendAudio]);

  const cancelRecording = (): void => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
      setAudioData(null);
      state.mutate((oldState) => {
        return {
          ...oldState,
          chatState: { ...oldState.chatState, isLoading: false },
        };
      });
    }
  };

  return !recording ? (
    <Tooltip title='Record Audio'>
      <IconButton color='primary' disabled={disabled} onClick={startRecording}>
        <MicIcon />
      </IconButton>
    </Tooltip>
  ) : (
    <>
      <Tooltip title='Cancel Recording'>
        <IconButton color='error' onClick={cancelRecording}>
          <CancelIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Send Audio'>
        {/* Finish recording triggers data as soon as audio data is available */}
        <IconButton color='primary' onClick={finishRecording}>
          <SendIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}

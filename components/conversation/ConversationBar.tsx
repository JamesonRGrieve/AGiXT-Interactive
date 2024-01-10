import React, { useContext, useEffect, useState } from 'react';
import AudioRecorder from '../conversation/AudioRecorder';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import {
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { setCookie } from 'cookies-next';
import { DeleteForever } from '@mui/icons-material';
import SwitchDark from 'jrgcomponents/theming/SwitchDark';
import SwitchColorblind from 'jrgcomponents/theming/SwitchColorblind';
import Link from 'next/link';
import { ChatContext } from '../../types/ChatState';

export default function ConversationBar({ mode }: { mode: 'prompt' | 'chain' }) {
  const state = useContext(ChatContext);
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [message, setMessage] = useState('');
  const handleUploadFiles = async () => {
    // Uploaded files will be formatted like [{"file_name": "file_content"}]
    const newuploadedFiles: { [x: string]: string }[] = [];
    // Format for state.uploadedFiles should be [{"file_name": "file_content"}]
    // Iterate through the files and add them to the form data
    for (const file of state.chatState.uploadedFiles) {
      const fileContent = await file.text();
      newuploadedFiles.push({ [file.name]: fileContent });
      state.mutate((oldState) => ({ ...oldState, chatState: { ...oldState.chatState, uploadedFiles: newuploadedFiles } }));
      setFileUploadOpen(false);
    }
  };
  const handleSendMessage = async () => {
    if (mode == 'chain') {
      runChain();
    } else {
      (async () => {
        state.mutate((oldState) => {
          return {
            ...oldState,
            chatState: {
              ...oldState.chatState,
              conversation: [
                ...oldState.chatState.conversation,
                { role: 'USER', message: message, timestamp: 'Just now...' }
              ]
            }
          };
        });
      })();
      runPrompt();
      setMessage('');
    }
  };
  const runChain = async () => {
    state.mutate((oldState) => {
      return {
        ...oldState,
        chatState: { ...oldState.chatState, isLoading: true }
      };
    });
    const agentOverride = state.chatConfig.useSelectedAgent ? state.chatConfig.selectedAgent : '';
    state.chatConfig.chainRunConfig.chainArgs['conversation_name'] = state.chatConfig.conversationName;
    const response = await state.sdk.runChain(
      state.chain,
      message,
      agentOverride,
      false,
      0,
      state.chatConfig.chainRunConfig.chainArgs
    );
    state.mutate((oldState) => ({
      ...oldState,
      chatState: { ...oldState.chatState, lastResponse: response, isLoading: false }
    }));
  };

  const runPrompt = async () => {
    state.mutate((oldState) => {
      return { ...oldState, chatState: { ...oldState.chatState, isLoading: true } };
    });
    const args: any = state.sdk.getPromptArgs(state.prompt, state.promptCategory);
    if (message) args.user_input = message;
    if (state.chatState.uploadedFiles.length > 0) args.import_files = state.chatState.uploadedFiles;
    const promptName =
      state.prompt + (state.prompt == 'Chat with Commands' && state.chatState.hasFiles ? ' with Files' : '');
    const skipArgs = [
      'conversation_history',
      'context',
      'COMMANDS',
      'command_list',
      'date',
      'agent_name',
      'working_directory',
      'helper_agent_name',
      'prompt_name',
      'context_results',
      'conversation_results',
      'conversation_name',
      'prompt_category',
      'websearch',
      'websearch_depth',
      'enable_memory',
      'inject_memories_from_collection_number',
      'context_results',
      'persona',
      ''
    ];
    for (const arg of skipArgs) {
      delete args[arg];
    }
    const stateArgs = {
      prompt_category: state.promptCategory,
      conversation_name: state.chatConfig.conversationName,
      context_results: state.chatConfig.contextResults,
      shots: state.chatConfig.shots,
      browse_links: state.chatConfig.browseLinks,
      websearch: state.chatConfig.webSearch,
      websearch_depth: state.chatConfig.websearchDepth,
      disable_memory: !state.chatConfig.enableMemory,
      inject_memories_from_collection_number: state.chatConfig.injectMemoriesFromCollectionNumber,
      conversation_results: state.chatConfig.conversationResults,
      ...args
    };
    console.log('State args', stateArgs);
    console.log('State', state);
    console.log('Prompt name', promptName);
    const response = await state.sdk.promptAgent(state.chatConfig.selectedAgent, promptName, stateArgs);
    state.mutate((oldState) => {
      return {
        ...oldState,
        chatState: { ...oldState.chatState, lastResponse: response, isLoading: false, uploadedFiles: [] }
      };
    });

    (async () => {
      const conversation = await state.sdk.getConversation(
        state.chatConfig.selectedAgent,
        state.chatConfig.conversationName
      );
      state.mutate((oldState) => {
        return { ...oldState, chatState: { ...oldState.chatState, conversation: conversation } };
      });
    })();
  };

  return (
    <>
      <Box px='1rem' display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
        <TextField
          label={`Type your message to ${state.chatConfig.selectedAgent} here.`}
          placeholder={`Type your message to ${state.chatConfig.selectedAgent} here.`}
          multiline
          rows={2}
          fullWidth
          value={message}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && message) {
              event.preventDefault();
              handleSendMessage();
            }
          }}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ my: 2 }}
          disabled={state.chatState.isLoading}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                {state.chatConfig.enableFileUpload && (
                  <>
                    <IconButton
                      color='info'
                      onClick={() => {
                        setFileUploadOpen(true);
                        state.mutate((oldState) => ({
                          ...oldState,
                          chatState: { ...oldState.chatState, uploadedFiles: [] }
                        }));
                      }}
                      disabled={state.chatState.isLoading}
                      sx={{ height: '56px' }}>
                      <NoteAddOutlinedIcon />
                    </IconButton>
                    <Dialog
                      open={fileUploadOpen}
                      onClose={() => {
                        setFileUploadOpen(false);
                      }}>
                      <DialogTitle id='form-dialog-title'>Upload Files</DialogTitle>
                      <DialogContent>
                        <DialogContentText>Please upload the files you would like to send.</DialogContentText>
                        <input
                          accept='*'
                          id='contained-button-file'
                          multiple
                          type='file'
                          onChange={(e) => {
                            state.mutate((oldState) => ({
                              ...oldState,
                              chatState: { ...oldState.chatState, uploadedFiles: Array(e.target.files) }
                            }));
                          }}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => {
                            setFileUploadOpen(false);
                          }}
                          color='error'>
                          Cancel
                        </Button>
                        <Button onClick={handleUploadFiles} color='info' disabled={state.chatState.isLoading}>
                          Upload
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )}
                {!state.chatState.isLoading && (
                  <Tooltip title='Send Message'>
                    <IconButton
                      color='info'
                      onClick={handleSendMessage}
                      disabled={state.chatState.isLoading}
                      sx={{ height: '56px', padding: '0.5rem' }}>
                      <SendIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {/*mode == 'prompt' && <AudioRecorder />*/}
              </InputAdornment>
            )
          }}
        />
        {process.env.NEXT_PUBLIC_AGIXT_SHOW_CONVERSATION_BAR !== 'true' && (
          <Tooltip title='Reset Conversation (Forever)'>
            <IconButton
              color='info'
              onClick={() => {
                const uuid = crypto.randomUUID();
                setCookie('uuid', uuid, { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN, maxAge: 2147483647 });
                state.mutate((oldState) => ({
                  ...oldState,
                  chatConfig: { ...oldState.chatConfig, conversationName: uuid }
                }));
              }}
              disabled={state.chatState.isLoading}
              sx={{ height: '56px', padding: '1rem' }}>
              <DeleteForever />
            </IconButton>
          </Tooltip>
        )}
        {process.env.NEXT_PUBLIC_AGIXT_SHOW_APP_BAR !== 'true' && (
          <Box display='flex' flexDirection='column' alignItems='center'>
            <SwitchDark />
            <SwitchColorblind />
          </Box>
        )}
      </Box>
      {process.env.NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE && (
        <Box>
          <Typography
            variant='caption'
            align='center'
            style={{ width: '100%', display: 'inline-block', fontWeight: 'bold', fontSize: '0.8rem' }}>
            <Link style={{ textDecoration: 'none' }} href='https://github.com/Josh-XT/AGiXT'>
              {process.env.NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE}
            </Link>{' '}
            • Built by{' '}
            <Link style={{ textDecoration: 'none' }} href='https://github.com/Josh-XT'>
              JoshXT
            </Link>{' '}
            and{' '}
            <Link style={{ textDecoration: 'none' }} href='https://github.com/jamesonrgrieve'>
              James G.
            </Link>{' '}
            &copy; 2023
          </Typography>
        </Box>
      )}
    </>
  );
}

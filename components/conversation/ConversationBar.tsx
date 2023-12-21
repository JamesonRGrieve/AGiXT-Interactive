import React, { useEffect, useState } from 'react';
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
  Theme,
  Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { AGiXTState } from '../../types/AGiXTState';
import { setCookie } from 'cookies-next';
import { DeleteForever } from '@mui/icons-material';
import SwitchDark from 'jrgcomponents/theming/SwitchDark';
import SwitchColorblind from 'jrgcomponents/theming/SwitchColorblind';
import Link from 'next/link';

export default function ConversationBar({
  mode,
  state,
  theme
}: {
  mode: 'prompt' | 'chain';
  state: AGiXTState;
  theme: Theme;
}) {
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [message, setMessage] = useState('');
  const handleUploadFiles = async () => {
    // Uploaded files will be formatted like [{"file_name": "file_content"}]
    const newuploadedFiles: { [x: string]: string }[] = [];
    // Format for AGiXTState.uploadedFiles should be [{"file_name": "file_content"}]
    // Iterate through the files and add them to the form data
    for (const file of state.chatState.uploadedFiles) {
      const fileContent = await file.text();
      newuploadedFiles.push({ [file.name]: fileContent });
      state.mutate((oldState) => ({ ...oldState, chatState: { ...oldState.chatState, uploadedFiles: newuploadedFiles } }));
      setFileUploadOpen(false);
    }
  };
  useEffect(() => {
    console.log('Getting args for prompt.', state.prompt.name, state.promptCategory);
    (async function getArgs(promptName, promptCategory) {
      const promptArgData = await state.sdk.getPromptArgs(promptName, promptCategory);
      if (promptArgData) {
        const newArgs = {};
        for (const arg of promptArgData) {
          if (arg !== '') {
            newArgs[arg] = '';
          }
        }
        state.mutate((oldState) => {
          return { ...oldState, chatConfig: { ...state.chatConfig, promptArgs: newArgs } };
        });
      }
    })(state.prompt.name, state.promptCategory);
  }, [state.prompt.name, state.promptCategory, state.sdk]);

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
    const agentOverride = state.chatConfig.useSelectedAgent ? state.agent.name : '';
    state.chatConfig.chainRunConfig.chainArgs['conversation_name'] = state.chatConfig.conversationName;
    const response = await state.sdk.runChain(
      state.chain.name,
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
    const args: any = { ...state.prompt.args };
    if (message) args.user_input = message;
    if (state.chatState.uploadedFiles.length > 0) args.import_files = state.chatState.uploadedFiles;
    const promptName =
      state.prompt.name + (state.prompt.name == 'Chat with Commands' && state.chatState.hasFiles ? ' with Files' : '');
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
    const response = await state.sdk.promptAgent(state.agent.name, promptName, stateArgs);
    state.mutate((oldState) => {
      return {
        ...oldState,
        chatState: { ...oldState.chatState, lastResponse: response, isLoading: false, uploadedFiles: [] }
      };
    });

    (async () => {
      const conversation = await state.sdk.getConversation(state.agent.name, state.chatConfig.conversationName);
      state.mutate((oldState) => {
        return { ...oldState, chatState: { ...oldState.chatState, conversation: conversation } };
      });
    })();
  };

  return (
    <>
    <Box px='1rem' display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
      <TextField
        label={`Ask your question to ${state.agent.name} here.`}
        placeholder={`Ask your question to ${state.agent.name} here.`}
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
                      state.mutate((oldState) => ({ ...oldState, chatState: { ...oldState.chatState, uploadedFiles: [] } }));
                    }}
                    disabled={state.chatState.isLoading}
                    sx={{ height: '56px' }}
                  >
                    <NoteAddOutlinedIcon />
                  </IconButton>
                  <Dialog
                    open={fileUploadOpen}
                    onClose={() => {
                      setFileUploadOpen(false);
                    }}
                  >
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
                        color='error'
                      >
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
                    sx={{ height: '56px', padding: '0px' }}
                  >
                    <SendIcon />
                  </IconButton>
                </Tooltip>
              )}
              {mode == 'prompt' && <AudioRecorder state={state} />}
              {process.env.NEXT_PUBLIC_AGIXT_SHOW_CONVERSATION_BAR !== 'true' && (
                <Tooltip title='Reset Conversation'>
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
                    sx={{ height: '56px', padding: '0px' }}
                  >
                    <DeleteForever />
                  </IconButton>
                </Tooltip>
              )}
            </InputAdornment>
          )
        }}
      />
      {process.env.NEXT_PUBLIC_AGIXT_SHOW_APP_BAR !== 'true' && (
        <Box display='flex' flexDirection='column' alignItems='center'>
          <SwitchDark />
          <SwitchColorblind />
        </Box>
      )}
    </Box>
    
    
    <Box>
        <Typography variant='caption' align="center" style={{ width: '100%', display: 'inline-block', fontWeight:"bold", fontSize:"0.8rem" }}><Link style={{textDecoration: "none"}} href="https://github.com/Josh-XT/AGiXT">Powered with Christmas Spirit from AGiXT</Link>, Crafted by <Link style={{textDecoration: "none"}} href="https://github.com/Josh-XT">JoshXT</Link> and <Link style={{textDecoration: "none"}} href="https://github.com/jamesonrgrieve">James G.</Link> &copy; 2023</Typography>
    </Box>
    
    </>
  );
}

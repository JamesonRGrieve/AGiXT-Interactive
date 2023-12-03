import { useEffect, useState, useMemo } from 'react';
import ConversationHistory from './conversation/ConversationHistory';
import ConversationSelector from './conversation/ConversationSelector';
import AudioRecorder from './conversation/AudioRecorder';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import { setCookie, getCookie } from 'cookies-next';
import Box from '@mui/material/Box';
import AGiXTSDK from 'agixt';
import Tooltip from '@mui/material/Tooltip';

import Header from './Header';
import {
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { AGiXTContext, AGiXTState } from '../types/AGiXTState';
import { ChatProps } from './AGiXTChat';

export default function Chat({state, mode, showAppBar, showConversationSelector}: ChatProps & {state: AGiXTState) {


  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [message, setMessage] = useState('');
  const handleUploadFiles = async () => {
    const newuploadedFiles = [];
    // Format for AGiXTState.uploadedFiles should be [{"file_name": "file_content"}]
    // Iterate through the files and add them to the form data
    for (const file of state.chatState.uploadedFiles) {
      const fileContent = await file.text();
      newuploadedFiles.push({ [file.name]: fileContent });
    }
    state.mutate({ ...state, chatState: { ...state.chatState, uploadedFiles: newuploadedFiles }  });
    setFileUploadOpen(false);
  };

  useEffect(() => {
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
          return { ...oldState, chatConfig: {...state.chatConfig, promptArgs: newArgs} };
        });
      }
    })(state.chatConfig.promptConfig.promptName, state.chatConfig.promptConfig.promptCategory);
  }, [state.chatConfig.promptConfig.promptName, state,chatConfig.promptConfig.promptCategory, state.sdk]);
  // Uploaded files will be formatted like [{"file_name": "file_content"}]

  const runChain = async () => {
    state.mutate({ ...state, chatState: {...state.chatState, isLoading: true }});
    const agentOverride = state.chatConfig.promptConfig.useSelectedAgent ? state.agent.name : '';
    state.chatConfig.chainRunConfig.chainArgs['conversation_name'] = state.chatConfig.conversationName;
    const response = await state.sdk.runChain(
      state.chatConfig.chainRunConfig.selectedChain,
      message,
      agentOverride,
      false,
      0,
      state.chatConfig.chainRunConfig.chainArgs
    );
    state.mutate({ ...state, chatState: {...state.chatState, lastResponse: response, isLoading: false}});
  };
  const PromptAgent = async (
    message,
    contextResults = 5,
    shots = 1,
    browseLinks = false,
    websearch = false,
    websearchDepth = 0,
    enableMemory = false,
    injectMemoriesFromCollectionNumber = 0,
    conversationResults = 5
  ) => {
    state.mutate({ ...state, chatState: {...state.chatState, isLoading: true }});

    if (message) {
      state.mutate({ ...state, chatConfig: { ...state.chatConfig, promptConfig: {...state.chatConfig.promptConfig, promptArgs: {...state.chatConfig.promptConfig.promptArgs, user_input: message  }} } });
    }
    if (state.chatState.hasFiles && state.chatConfig.promptConfig.promptName == 'Chat with Commands') {
      state.mutate({...state, chatConfig: {...state.chatConfig, promptConfig: {...state.chatConfig.promptConfig, promptName:'Chat with Commands and Files' }  }})
    }
    if (state.chatState.uploadedFiles.length > 0) {
      state.mutate({ ...state, chatConfig: { ...state.chatConfig, promptConfig: {...state.chatConfig.promptConfig, promptArgs: {...state.chatConfig.promptConfig.promptArgs, import_files: state.chatState.uploadedFiles  }} } });
    }
    const disableMemory = !enableMemory;
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
    const refinedArgs = { ...state.chatConfig.promptConfig.promptArgs };
    for (const arg of skipArgs) {
      delete refinedArgs[arg];
    }
    const promptArguments = {
      prompt_category: state.chatConfig.promptConfig.promptCategory,
      conversation_name: state.chatConfig.conversationName,
      context_results: contextResults,
      shots: shots,
      browse_links: browseLinks,
      websearch: websearch,
      websearch_depth: websearchDepth,
      disable_memory: disableMemory,
      inject_memories_from_collection_number: injectMemoriesFromCollectionNumber,
      conversation_results: conversationResults,
      ...refinedArgs
    };
    if (mode == 'chain')       state.mutate({...state, chatConfig: {...state.chatConfig, promptConfig: {...state.chatConfig.promptConfig, promptName: state.chatConfig.chainRunConfig.selectedChain }  }})
    ;
    const response = await state.sdk.promptAgent(state.agent.name, state.chatConfig.promptConfig.promptName, promptArguments);
    state.mutate({ ...state, chatState: {...state.chatState, lastResponse: response, isLoading: false, uploadedFiles: [] }});

    (async () => {
      const conversation = await state.sdk.getConversation(state.agent.name, state.chatConfig.conversationName);
      state.mutate({ ...state, chatState: {...state.chatState, conversation: conversation }});
    })();
  };

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey && AGiXTState.message) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  const handleSendMessage = async () => {
    if (mode == 'chain') {
      runChain();
    } else {
      await PromptAgent(
        message,
        state.chatConfig.contextResults,
        state.chatConfig.shots,
        state.chatConfig.browseLinks,
        state.chatConfig.webSearch,
        state.chatConfig.websearchDepth,
        state.chatConfig.enableMemory,
        state.chatConfig.injectMemoriesFromCollectionNumber,
        state.chatConfig.conversationResults
      );
    }
    setMessage('');
  };
  return (
      <Box height='100%' display='flex' flexDirection='column'>
        {AGiXTState.showAppBar && <Header showConversationSelector={AGiXTState.showConversationSelector} />}

        <Box
          style={{
            maxWidth: '100%',
            flexGrow: '1',
            transition: AGiXTState.theme.transitions.create('margin', {
              easing: AGiXTState.theme.transitions.easing.sharp,
              duration: AGiXTState.theme.transitions.duration.leavingScreen
            }),
            display: 'flex',
            flexDirection: 'column'
          }}
          component='main'
        >
          <ConversationHistory />
          <Box px='1rem'>
            <TextField
              label='Ask your question here.'
              placeholder='Ask your question here.'
              multiline
              rows={2}
              fullWidth
              value={AGiXTState.message}
              onChange={(e) => setAGiXTState({ ...AGiXTState, message: e.target.value })}
              onKeyPress={handleKeyPress}
              sx={{ my: 2 }}
              disabled={AGiXTState.isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {AGiXTState.enableFileUpload && (
                      <>
                        <IconButton
                          color='info'
                          onClick={() => {
                            setAGiXTState({ ...AGiXTState, uploadedFiles: [], openFileUpload: true });
                          }}
                          disabled={AGiXTState.isLoading}
                          sx={{ height: '56px' }}
                        >
                          <NoteAddOutlinedIcon />
                        </IconButton>
                        <Dialog
                          open={AGiXTState.openFileUpload}
                          onClose={() => {
                            setAGiXTState({ ...AGiXTState, openFileUpload: false });
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
                                setAGiXTState({ ...AGiXTState, uploadedFiles: Array(e.target.files) });
                              }}
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={() => {
                                setAGiXTState({ ...AGiXTState, openFileUpload: false });
                              }}
                              color='error'
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleUploadFiles} color='info' disabled={AGiXTState.isLoading}>
                              Upload
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </>
                    )}
                    {!AGiXTState.isLoading && (
                      <Tooltip title='Send Message'>
                        <IconButton color='info' onClick={handleSendMessage} sx={{ height: '56px', padding: '0px' }}>
                          <SendIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {AGiXTState.mode == 'prompt' && (
                      <AudioRecorder
                        conversationName={AGiXTState.conversationName}
                        contextResults={AGiXTState.contextResults}
                        conversationResults={AGiXTState.conversationResults}
                        agentName={AGiXTState.agentName}
                        sdk={sdk}
                      />
                    )}
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Box>
      </Box>
  );
}

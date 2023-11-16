import { useEffect, useState, useMemo } from 'react';
import ConversationHistory from './conversation/ConversationHistory';
import ConversationSelector from './conversation/ConversationSelector';
import AudioRecorder from './conversation/AudioRecorder';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import { setCookie, getCookie } from 'cookies-next';
import Box from '@mui/material/Box';
import AGiXTSDK from 'agixt';
import Tooltip from '@mui/material/Tooltip';

import { useTheme } from '@mui/material/styles';
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
import { AGiXTContext, AGiXTState } from '../types/AGiXTContext';

export default function AGiXTChat(props: AGiXTState) {
  const [AGiXTState, setAGiXTState] = useState<AGiXTState>({
    ...props,
    message: '',
    identified: false,
    authenticated: false,
    uploadedFiles: [],
    userData: {},
    conversation: [],
    conversations: undefined,
    lastResponse: '',
    isLoading: false,
    openFileUpload: false,
    promptArgs: {},
    insightAgent: props.insightAgent || props.agentName || '',
    hasFiles: false
  });
  const theme = useTheme();
  const apiKey = getCookie(AGiXTState.apiKeyCookie) || '';
  const sdk = useMemo(() => {
    return new AGiXTSDK({
      baseUri: AGiXTState.baseUri,
      apiKey: apiKey
    });
  }, [AGiXTState.baseUri, apiKey]);

  //main: darkAGiXTState.mode ? "#000000" : "#273043",

  const handleUploadFiles = async () => {
    const newuploadedFiles = [];
    // Format for AGiXTState.uploadedFiles should be [{"file_name": "file_content"}]
    // Iterate through the files and add them to the form data
    for (const file of AGiXTState.uploadedFiles) {
      const fileContent = await file.text();
      newuploadedFiles.push({ [file.name]: fileContent });
    }
    setAGiXTState({ ...AGiXTState, uploadedFiles: newuploadedFiles });
    setAGiXTState({ ...AGiXTState, openFileUpload: false });
  };
  useEffect(() => {
    console.log('AGiXT State Changed', AGiXTState);
  }, [AGiXTState]);

  useEffect(() => {
    async function getArgs(promptName, promptCategory) {
      const promptArgData = await sdk.getPromptArgs(promptName, promptCategory);
      if (promptArgData) {
        const newArgs = {};
        for (const arg of promptArgData) {
          if (arg !== '') {
            newArgs[arg] = '';
          }
        }
        setAGiXTState((oldState) => {
          return { ...oldState, promptArgs: newArgs };
        });
      }
    }
    getArgs(AGiXTState.promptName, AGiXTState.promptCategory);
  }, [AGiXTState.promptName, AGiXTState.promptCategory, sdk]);
  // Uploaded files will be formatted like [{"file_name": "file_content"}]

  const runChain = async () => {
    setAGiXTState({ ...AGiXTState, isLoading: true });
    const agentOverride = AGiXTState.useSelectedAgent ? AGiXTState.agentName : '';
    AGiXTState.chainArgs['conversation_name'] = AGiXTState.conversationName;
    const response = await sdk.runChain(
      AGiXTState.selectedChain,
      AGiXTState.message,
      agentOverride,
      false,
      0,
      AGiXTState.chainArgs
    );
    setAGiXTState({ ...AGiXTState, isLoading: false });
    setAGiXTState({ ...AGiXTState, lastResponse: response });
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
    setAGiXTState({ ...AGiXTState, isLoading: true });

    if (message) {
      setAGiXTState({ ...AGiXTState, promptArgs: { ...AGiXTState.promptArgs, user_input: message } });
    }
    if (AGiXTState.hasFiles && AGiXTState.promptName == 'Chat with Commands') {
      setAGiXTState({ ...AGiXTState, promptName: 'Chat with Commands and Files' });
    }
    if (AGiXTState.uploadedFiles.length > 0) {
      setAGiXTState({ ...AGiXTState, promptArgs: { ...AGiXTState.promptArgs, import_files: AGiXTState.uploadedFiles } });
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
    const refinedArgs = { ...AGiXTState.promptArgs };
    for (const arg of skipArgs) {
      delete refinedArgs[arg];
    }
    const promptArguments = {
      prompt_category: AGiXTState.promptCategory,
      conversation_name: AGiXTState.conversationName,
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
    if (AGiXTState.mode == 'chain') setAGiXTState({ ...AGiXTState, promptName: AGiXTState.selectedChain });
    const response = await sdk.promptAgent(AGiXTState.agentName, AGiXTState.promptName, promptArguments);
    setAGiXTState({ ...AGiXTState, isLoading: false, lastResponse: response, uploadedFiles: [] });
    const fetchConversation = async () => {
      const conversation = await sdk.getConversation(AGiXTState.agentName, AGiXTState.conversationName);
      setAGiXTState({ ...AGiXTState, conversation: conversation });
    };
    fetchConversation();
  };

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey && AGiXTState.message) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  const handleSendMessage = async () => {
    if (AGiXTState.mode == 'chain') {
      runChain();
      setAGiXTState({ ...AGiXTState, message: '' });
      return;
    } else {
      await PromptAgent(
        AGiXTState.message,
        AGiXTState.contextResults,
        AGiXTState.shots,
        AGiXTState.browseLinks,
        AGiXTState.websearch,
        AGiXTState.websearchDepth,
        AGiXTState.enableMemory,
        AGiXTState.injectMemoriesFromCollectionNumber,
        AGiXTState.conversationResults
      );
      setAGiXTState({ ...AGiXTState, message: '' });
    }
  };
  return (
    <AGiXTContext.Provider value={{ ...AGiXTState, mutate: setAGiXTState, sdk: sdk }}>
      <Box height='100%' display='flex' flexDirection='column'>
        {AGiXTState.showAppBar && <Header showConversationSelector={AGiXTState.showConversationSelector} />}

        <Box
          style={{
            maxWidth: '100%',
            flexGrow: '1',
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen
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
    </AGiXTContext.Provider>
  );
}

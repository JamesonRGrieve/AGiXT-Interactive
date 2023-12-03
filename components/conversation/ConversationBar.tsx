import { useEffect, useState } from 'react';
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
    Theme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { AGiXTState } from '../../types/AGiXTState';
import React from 'react';


export default function ConversationBar({ mode, state, theme }: { mode: 'chat' | 'prompt' | 'instruct' | 'chain', state: AGiXTState, theme: Theme }) {
    const [fileUploadOpen, setFileUploadOpen] = useState(false);
    const [message, setMessage] = useState('');
    const handleUploadFiles = async () => {
        const newuploadedFiles: { [x: string]: string }[] = [];
        // Format for AGiXTState.uploadedFiles should be [{"file_name": "file_content"}]
        // Iterate through the files and add them to the form data
        for (const file of state.chatState.uploadedFiles) {
            const fileContent = await file.text();
            newuploadedFiles.push({ [file.name]: fileContent });
            state.mutate((oldState) => ({ ...oldState, chatState: { ...oldState.chatState, uploadedFiles: newuploadedFiles } }));
            setFileUploadOpen(false);
        };
    };
        useEffect(() => {
            console.log("Getting args for prompt.", state.chatConfig.promptConfig.promptName, state.chatConfig.promptConfig.promptCategory);
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
            })(state.chatConfig.promptConfig.promptName, state.chatConfig.promptConfig.promptCategory);
        }, [state.chatConfig.promptConfig.promptName, state.chatConfig.promptConfig.promptCategory, state.sdk]);
        // Uploaded files will be formatted like [{"file_name": "file_content"}]

        const handleKeyPress = async (event) => {
            if (event.key === 'Enter' && !event.shiftKey && message) {
                event.preventDefault();
                handleSendMessage();
            }
        };
        const handleSendMessage = async () => {
            if (mode == 'chain') {
                runChain();
            } else {
                (async () => {
                    state.mutate((oldState) => { return { ...oldState, chatState: { ...oldState.chatState, conversation: [...oldState.chatState.conversation, { role: "USER", message: message, timestamp: "Just now..." }] } } });
                })();

                PromptAgent(
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
            state.mutate((oldState) => ({ ...oldState, chatState: { ...oldState.chatState, lastResponse: response, isLoading: false } }));
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
            state.mutate((oldState) => { return { ...oldState, chatState: { ...oldState.chatState, isLoading: true } } });
            if (message) {
                state.mutate((oldState) => {
                    return {
                        ...oldState,
                        chatConfig: {
                            ...oldState.chatConfig,
                            promptConfig: {
                                ...oldState.chatConfig.promptConfig,
                                promptArgs: { ...oldState.chatConfig.promptConfig.promptArgs, user_input: message }
                            }
                        }
                    }
                });
            }
            if (state.chatState.hasFiles && state.chatConfig.promptConfig.promptName == 'Chat with Commands') {
                state.mutate((oldState) => {
                    return {
                        ...oldState,
                        chatConfig: {
                            ...oldState.chatConfig,
                            promptConfig: { ...oldState.chatConfig.promptConfig, promptName: 'Chat with Commands and Files' }
                        }
                    }
                });
            }
            if (state.chatState.uploadedFiles.length > 0) {
                state.mutate((oldState) => {
                    return {
                        ...oldState,
                        chatConfig: {
                            ...oldState.chatConfig,
                            promptConfig: {
                                ...oldState.chatConfig.promptConfig,
                                promptArgs: { ...oldState.chatConfig.promptConfig.promptArgs, import_files: oldState.chatState.uploadedFiles }
                            }
                        }
                    }
                });
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
            if (mode == 'chain')
                state.mutate((oldState) => {
                    return {
                        ...oldState,
                        chatConfig: {
                            ...oldState.chatConfig,
                            promptConfig: { ...oldState.chatConfig.promptConfig, promptName: oldState.chatConfig.chainRunConfig.selectedChain }
                        }
                    }
                });
            console.log(state.chatConfig.promptConfig);
            const response = await state.sdk.promptAgent(
                state.agent.name,
                state.chatConfig.promptConfig.promptName,
                promptArguments
            );
            state.mutate((oldState) => {
                return {
                    ...oldState,
                    chatState: { ...oldState.chatState, lastResponse: response, isLoading: false, uploadedFiles: [] }
                }
            });

            (async () => {
                const conversation = await state.sdk.getConversation(state.agent.name, state.chatConfig.conversationName);
                state.mutate((oldState) => { return { ...oldState, chatState: { ...oldState.chatState, conversation: conversation } } });
            })();
        };


        return <Box px='1rem'>
            <TextField
                label='Ask your question here.'
                placeholder='Ask your question here.'
                multiline
                rows={2}
                fullWidth
                value={message}
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
                                    <IconButton color='info' onClick={handleSendMessage} disabled={state.chatState.isLoading} sx={{ height: '56px', padding: '0px' }}>
                                        <SendIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {mode == 'prompt' && <AudioRecorder state={state} />}
                        </InputAdornment>
                    )
                }}
            />
        </Box>
    }
'use client';
import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import {
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  Chip,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { setCookie } from 'cookies-next';
import { CheckCircle, DeleteForever, Pending } from '@mui/icons-material';
import SwitchDark from 'jrgcomponents/Theming/SwitchDark';
import SwitchColorblind from 'jrgcomponents/Theming/SwitchColorblind';
import { ChatContext } from '../../types/ChatContext';
import AudioRecorder from './AudioRecorder';

export default function ChatBar({
  onSend,
  disabled,
  clearOnSend = true,
  showChatThemeToggles = process.env.NEXT_PUBLIC_AGIXT_SHOW_CHAT_THEME_TOGGLES === 'true',
  enableFileUpload = false,
  enableVoiceInput = false,
}: {
  onSend: (message: string | object, uploadedFiles?: { [x: string]: string }) => Promise<void>;
  disabled: boolean;
  clearOnSend?: boolean;
  showChatThemeToggles: boolean;
  enableFileUpload?: boolean;
  enableVoiceInput?: boolean;
}): ReactNode {
  const state = useContext(ChatContext);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState<number>(-1);
  const [uploadedFiles, setUploadedFiles] = useState<{ [x: string]: string }>({});
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [alternativeInputActive, setAlternativeInputActive] = useState(false);

  useEffect(() => {
    console.log(uploadedFiles);
  }, [uploadedFiles]);
  const handleUploadFiles = async (event): Promise<void> => {
    const newUploadedFiles: { [x: string]: string } = {};
    for (const file of event.target.files) {
      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = (): void => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      newUploadedFiles[file.name] = fileContent as string;
    }
    setUploadedFiles((previous) => ({ ...previous, ...newUploadedFiles }));
    setFileUploadOpen(false);
  };
  const handleSend = useCallback(
    (message, uploadedFiles) => {
      setTimer(0);
      setLoading(true);
      event.preventDefault();
      if (clearOnSend) {
        setMessage('');
        setUploadedFiles({});
      }
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 100);
      onSend(message, uploadedFiles)
        .then(() => {
          clearInterval(interval);
          setLoading(false);
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    [clearOnSend, onSend],
  );
  return (
    <Box px='1rem' display='flex' flexDirection='column' justifyContent='space-between' alignItems='center'>
      <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
        <TextField
          label={`Enter your message to ${state.agent} here.`}
          placeholder={`Hello, ${state.agent}!`}
          multiline
          rows={2}
          fullWidth
          value={message}
          onKeyDown={async (event) => {
            if (event.key === 'Enter' && !event.shiftKey && message) {
              event.preventDefault();
              handleSend(message, uploadedFiles);
            }
          }}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ my: 2 }}
          disabled={disabled}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                {timer > -1 && (
                  <Box display='flex' gap='0.5rem' mx='0.5rem' alignItems='center'>
                    <Typography variant='caption'>{(timer / 10).toFixed(1)}s</Typography>
                    {loading ? <Pending /> : <CheckCircle />}
                  </Box>
                )}
                {enableFileUpload && (
                  <>
                    <IconButton
                      onClick={() => {
                        setFileUploadOpen(true);
                        state.mutate((oldState) => ({
                          ...oldState,
                          chatState: { ...oldState.chatState, uploadedFiles: [] },
                        }));
                      }}
                      disabled={disabled}
                      color='primary'
                      sx={{
                        height: '56px',
                      }}
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
                        <input accept='*' id='contained-button-file' multiple type='file' onChange={handleUploadFiles} />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
                {enableVoiceInput && (
                  <AudioRecorder
                    recording={alternativeInputActive}
                    setRecording={setAlternativeInputActive}
                    disabled={disabled}
                    onSend={handleSend}
                  />
                )}
                {!alternativeInputActive && (
                  <Tooltip title='Send Message'>
                    <span>
                      <IconButton
                        onClick={(event) => {
                          event.preventDefault();
                          handleSend(message, uploadedFiles);
                        }}
                        disabled={message.trim().length === 0 || disabled}
                        color='primary'
                        sx={{
                          height: '56px',
                          padding: '0.5rem',
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </InputAdornment>
            ),
          }}
        />
        {process.env.NEXT_PUBLIC_AGIXT_SHOW_CONVERSATION_BAR !== 'true' &&
          process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_MODE === 'uuid' && (
            <Tooltip title='Reset Conversation (Forever)'>
              <IconButton
                onClick={() => {
                  if (confirm('Are you sure you want to reset the conversation? This cannot be undone.')) {
                    const uuid = crypto.randomUUID();
                    setCookie('uuid', uuid, { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN, maxAge: 2147483647 });
                    state.mutate((oldState) => ({
                      ...oldState,
                      chatConfig: { ...oldState.chatConfig, conversationName: uuid },
                    }));
                  }
                }}
                disabled={disabled}
                color='primary'
                sx={{
                  height: '56px',
                  padding: '1rem',
                }}
              >
                <DeleteForever />
              </IconButton>
            </Tooltip>
          )}
        {showChatThemeToggles && (
          <Box display='flex' flexDirection='column' alignItems='center'>
            <SwitchDark />
            <SwitchColorblind />
          </Box>
        )}
      </Box>
      {Object.keys(uploadedFiles).length > 0 && (
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='start'
          width='100%'
          mb='1rem'
          gap='0.5rem'
          alignItems='center'
        >
          <Typography variant='caption'>Uploaded Files: </Typography>
          {Object.entries(uploadedFiles).map(([fileName]) => (
            <Chip
              key={fileName}
              label={fileName}
              onDelete={() => {
                setUploadedFiles((prevFiles) => {
                  const newFiles = { ...prevFiles };
                  delete newFiles[String(fileName)];
                  return newFiles;
                });
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

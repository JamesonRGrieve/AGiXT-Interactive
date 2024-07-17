'use client';
import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import {
  TextField,
  InputAdornment,
  Dialog as MUIDialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  Chip,
  Typography,
  Popover,
  MenuList,
  MenuItem,
  Switch,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import Dropzone from 'react-dropzone';
import SendIcon from '@mui/icons-material/Send';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { ArrowDropUp, CheckCircle, DeleteForever, Pending } from '@mui/icons-material';
import SwitchDark from 'jrgcomponents/Theming/SwitchDark';
import SwitchColorblind from 'jrgcomponents/Theming/SwitchColorblind';
import Dialog from 'jrgcomponents/Dialog';
import { InteractiveConfigContext } from '../../types/InteractiveConfigContext';
import AudioRecorder from './AudioRecorder';
import OverrideSwitch from './OverrideSwitch';

export default function ChatBar({
  onSend,
  disabled,
  loading,
  setLoading,
  clearOnSend = true,
  showChatThemeToggles = false,
  enableFileUpload = false,
  enableVoiceInput = false,
  showResetConversation = false,
  showOverrideSwitchesCSV = '',
}: {
  onSend: (message: string | object, uploadedFiles?: { [x: string]: string }) => Promise<string>;
  disabled: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  clearOnSend?: boolean;
  showChatThemeToggles: boolean;
  enableFileUpload?: boolean;
  enableVoiceInput?: boolean;
  showResetConversation?: boolean;
  showOverrideSwitchesCSV?: string;
}): ReactNode {
  const state = useContext(InteractiveConfigContext);
  const [timer, setTimer] = useState<number>(-1);
  const [uploadedFiles, setUploadedFiles] = useState<{ [x: string]: string }>({});
  const [message, setMessage] = useState('');
  const [alternativeInputActive, setAlternativeInputActive] = useState(false);
  useEffect(() => {
    console.log(uploadedFiles);
  }, [uploadedFiles]);
  const handleUploadFiles = async (event): Promise<void> => {
    for (const file of event.target.files) {
      uploadFile(file);
    }
  };
  const uploadFile = async (file: File) => {
    const newUploadedFiles: { [x: string]: string } = {};
    const fileContent = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = (): void => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    newUploadedFiles[file.name] = fileContent as string;
    setUploadedFiles((previous) => ({ ...previous, ...newUploadedFiles }));
  };
  const handleSave = useCallback((audio) => {
    const newUploadedFiles = {
      [`${new Date().getHours()}.${new Date().getMinutes()}.${new Date().getSeconds()}.recording.wav`]: audio,
    };
    console.log(newUploadedFiles);
    setUploadedFiles((previous) => ({ ...previous, ...newUploadedFiles }));
  }, []);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setTimer(0);
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 100);
    }
    // Cleanup function
    return () => {
      clearInterval(interval);
    };
  }, [loading]);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  return (
    <Box px='1rem' display='flex' flexDirection='column' justifyContent='space-between' alignItems='center'>
      <Dropzone
        noClick
        onDrop={(acceptedFiles) => {
          if (enableFileUpload) {
            for (const file of acceptedFiles) {
              uploadFile(file);
            }
          }
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <Box
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            width='100%'
            {...getRootProps()}
          >
            <TextField
              label={`Enter your message to ${state.agent} here.`}
              placeholder={`Hello, ${state.agent}!`}
              multiline
              maxRows={12}
              fullWidth
              value={message}
              onKeyDown={async (event) => {
                if (event.key === 'Enter' && !event.shiftKey && message) {
                  event.preventDefault();
                  await onSend(message, uploadedFiles);
                  setMessage('');
                }
              }}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ my: 2 }}
              disabled={disabled}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {timer > -1 && (
                      <Tooltip
                        title={
                          loading
                            ? `Your most recent interation has been underway (including all activities) for ${(timer / 10).toFixed(1)} seconds.`
                            : `Your last interaction took ${(timer / 10).toFixed(1)} seconds to completely resolve.`
                        }
                      >
                        <Box display='flex' gap='0.5rem' mx='0.5rem' alignItems='center'>
                          <Typography variant='caption' display='flex' position='relative' top='0.15rem'>
                            {(timer / 10).toFixed(1)}s
                          </Typography>
                          {loading ? <Pending color='info' /> : <CheckCircle color='success' />}
                        </Box>
                      </Tooltip>
                    )}
                    {showOverrideSwitchesCSV && (
                      <>
                        <Tooltip title='Override Settings'>
                          <IconButton
                            color='primary'
                            onClick={(event) => {
                              setAnchorEl(event.currentTarget);
                            }}
                          >
                            <ArrowDropUp />
                          </IconButton>
                        </Tooltip>
                        <Popover
                          open={Boolean(anchorEl)}
                          anchorEl={anchorEl}
                          onClose={() => setAnchorEl(null)}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                        >
                          <MenuList dense>
                            {showOverrideSwitchesCSV.split(',').includes('websearch') && (
                              <OverrideSwitch name='websearch' label='Websearch' />
                            )}
                            {showOverrideSwitchesCSV.split(',').includes('tts') && (
                              <OverrideSwitch name='tts' label='Text-to-Speech' />
                            )}
                            {showOverrideSwitchesCSV.split(',').includes('create-image') && (
                              <OverrideSwitch name='create-image' label='Generate an Image' />
                            )}
                          </MenuList>
                        </Popover>
                      </>
                    )}
                    {enableFileUpload && !alternativeInputActive && <UploadFiles {...{ handleUploadFiles, disabled }} />}
                    {enableVoiceInput && (
                      <AudioRecorder
                        recording={alternativeInputActive}
                        setRecording={setAlternativeInputActive}
                        disabled={disabled}
                        onSave={handleSave}
                      />
                    )}
                    {!alternativeInputActive && (
                      <SendMessage
                        {...{
                          handleSend: () => {
                            if (clearOnSend) {
                              setMessage('');
                              setUploadedFiles({});
                            }
                            onSend(message, uploadedFiles);
                          },
                          message,
                          uploadedFiles,
                          disabled,
                        }}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            {showResetConversation && <ResetConversation {...{ state, setCookie }} />}
            {showChatThemeToggles && <ThemeToggles />}
          </Box>
        )}
      </Dropzone>
      {Object.keys(uploadedFiles).length > 0 && <ListUploadedFiles {...{ uploadedFiles, setUploadedFiles }} />}
    </Box>
  );
}

// Extracted for better readability of the chat bar component and testing in Storybook
const Timer = ({ loading, timer }: any) => {
  return (
    <Tooltip
      title={
        loading
          ? `Your most recent interation has been underway (including all activities) for ${(timer / 10).toFixed(1)} seconds.`
          : `Your last interaction took ${(timer / 10).toFixed(1)} seconds to completely resolve.`
      }
    >
      <Box display='flex' gap='0.5rem' mx='0.5rem' alignItems='center'>
        <Typography variant='caption' display='flex' position='relative' top='0.15rem'>
          {(timer / 10).toFixed(1)}s
        </Typography>
        {loading ? <Pending color='info' /> : <CheckCircle color='success' />}
      </Box>
    </Tooltip>
  );
};

const OverrideSwitches = ({ setAnchorEl, anchorEl, showOverrideSwitches }: any) => {
  return (
    <>
      <Tooltip title='Override Settings'>
        <IconButton
          color='primary'
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
        >
          <ArrowDropUp />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuList dense>
          {showOverrideSwitches.split(',').includes('tts') && <OverrideSwitch name='tts' label='Text-to-Speech' />}
          {showOverrideSwitches.split(',').includes('websearch') && <OverrideSwitch name='websearch' label='Websearch' />}
        </MenuList>
      </Popover>
    </>
  );
};

const UploadFiles = ({ handleUploadFiles, disabled }: any) => {
  return (
    <Tooltip title='Upload File(s)'>
      <IconButton
        component='span'
        onClick={() => {
          document.getElementById('contained-button-file')?.click();
        }}
        disabled={disabled}
        color='primary'
      >
        <input
          accept='*'
          id='contained-button-file'
          multiple
          type='file'
          style={{ display: 'none' }}
          onChange={handleUploadFiles}
        />
        <NoteAddOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
};

const SendMessage = ({ handleSend, message, uploadedFiles, disabled }: any) => {
  return (
    <Tooltip title='Send Message'>
      <span>
        <IconButton
          onClick={(event) => {
            event.preventDefault();
            handleSend(message, uploadedFiles);
          }}
          disabled={(message.trim().length === 0 && Object.keys(uploadedFiles).length === 0) || disabled}
          color='primary'
          sx={{
            height: '56px',
            padding: '0.5rem',
          }}
          data-testid='send-message-button'
        >
          <SendIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

const ResetConversation = ({ state, setCookie }: any) => {
  return (
    <Dialog
      ButtonComponent={IconButton}
      ButtonProps={{
        children: <DeleteForever />,
        disabled: false,
        color: 'primary',
        sx: {
          height: '56px',
          padding: '1rem',
        },
      }}
      title='Are you sure you want to reset the conversation? This cannot be undone.'
      onConfirm={() => {
        const uuid = crypto.randomUUID();
        setCookie('uuid', uuid, { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN, maxAge: 2147483647 });
        state.mutate((oldState) => ({
          ...oldState,
          overrides: { ...oldState.overrides, conversation: uuid },
        }));
      }}
    />
  );
};

const ThemeToggles = (): ReactNode => {
  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <SwitchDark />
      <SwitchColorblind />
    </Box>
  );
};

const ListUploadedFiles = ({ uploadedFiles, setUploadedFiles }: any): ReactNode => {
  return (
    <Box display='flex' flexDirection='row' justifyContent='start' width='100%' mb='1rem' gap='0.5rem' alignItems='center'>
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
  );
};

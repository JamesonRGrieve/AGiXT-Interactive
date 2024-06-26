'use client';
import {
  Select,
  MenuItem,
  FormControl,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Tooltip,
  Box,
  useTheme,
  IconButton,
  InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import React, { use, useContext, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { InteractiveConfigContext } from '../../types/InteractiveConfigContext';
import { Add, DriveFileRenameOutline } from '@mui/icons-material';
import { setCookie } from 'cookies-next';
import { getAndFormatConversastion } from '../Chat/Chat';

export default function ConversationSelector(): React.JSX.Element {
  const state = useContext(InteractiveConfigContext);
  const theme = useTheme();
  const { data: conversationData } = useSWR<string[]>(`/conversation`, async () =>
    ((await state.agixt.getConversations()) as string[]).filter((conv) => conv !== '-'),
  );
  const { data: currentConversation } = useSWR(
    '/conversation/' + state.overrides.conversationName,
    async () => await getAndFormatConversastion(state),
    {
      fallbackData: [],
    },
  );
  const [openRenameConversation, setOpenRenameConversation] = useState(false);
  const [changedConversationName, setChangedConversationName] = useState(state.overrides.conversationName);
  // Make a confirmation dialog for deleting conversations
  const [openDeleteConversation, setOpenDeleteConversation] = useState(false);

  useEffect(() => {
    setChangedConversationName(state.overrides.conversationName);
    setCookie('conversation', state.overrides.conversationName, {
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    });
  }, [state.overrides.conversationName]);
  const handleAddConversation = async (): Promise<void> => {
    state.mutate((oldState) => ({
      ...oldState,
      overrides: { ...oldState.overrides, conversationName: '-' },
    }));
  };
  const handleRenameConversation = async (magic: boolean = true): Promise<void> => {
    if (state.overrides.conversationName) {
      const response = await state.agixt.renameConversation(
        state.agent,
        state.overrides.conversationName,
        magic ? '-' : changedConversationName,
      );
      await mutate('/conversation');
      //console.log(response);
      if (!response.startsWith('Error')) {
        state.mutate((oldState) => {
          return {
            ...oldState,
            overrides: {
              ...oldState.overrides,
              conversationName: response,
            },
          };
        });
        setOpenRenameConversation(false);
      }
    }
  };

  const handleDeleteConversation = async (): Promise<void> => {
    if (state.overrides.conversationName) {
      await state.agixt.deleteConversation(state.overrides.conversationName);
      await mutate('/conversation');
      state.mutate((oldState) => {
        return {
          ...oldState,
          overrides: {
            ...oldState.overrides,
            conversationName: conversationData[0],
          },
        };
      });
      setOpenDeleteConversation(false);
    }
  };

  const handleExportConversation = async (): Promise<void> => {
    if (state.overrides.conversationName) {
      const element = document.createElement('a');
      const file = new Blob([JSON.stringify(currentConversation)], {
        type: 'application/json',
      });
      element.href = URL.createObjectURL(file);
      element.download = `${state.overrides.conversationName}.json`;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    }
  };
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <>
      <FormControl
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'end',
          mr: '1rem',
        }}
        fullWidth
        size='small'
      >
        <Select
          sx={{
            color: theme.palette.mode === 'dark' ? 'white' : 'black',
            '.MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.mode === 'dark' ? '#CCC' : '#333' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.mode === 'dark' ? 'white' : 'black' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.mode === 'dark' ? 'white' : 'black',
            },
            '.MuiSvgIcon-root ': {
              fill: (theme.palette.mode === 'dark' ? 'white' : 'black') + ' !important',
            },
            '.MuiOutlinedInput-notchedOutline legend span': {
              // Targeting the floating label specifically
              color: theme.palette.mode === 'dark' ? 'white' : 'black',
              opacity: '1',
            },
            fontSize: '12px',
          }}
          variant='outlined'
          labelId='conversation-label'
          label='Select a Conversation'
          disabled={conversationData?.length === 0}
          value={state.overrides.conversationName}
          onChange={(e) =>
            state.mutate((oldState) => ({
              ...oldState,
              overrides: { ...oldState.overrides, conversationName: e.target.value },
            }))
          }
          endAdornment={
            <InputAdornment position='end' sx={{ marginRight: '1rem' }}>
              <Tooltip title='Add Conversation'>
                <IconButton onClick={() => handleAddConversation()} color='info' sx={{ minWidth: '20px' }}>
                  <Add sx={{ minWidth: '20px' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Rename Conversation'>
                <IconButton onClick={() => setOpenRenameConversation(true)} color='info' sx={{ minWidth: '20px' }}>
                  <DriveFileRenameOutline sx={{ minWidth: '20px' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Export Conversation'>
                <IconButton onClick={handleExportConversation} color='info' sx={{ minWidth: '20px' }}>
                  <FileDownloadOutlinedIcon sx={{ minWidth: '20px' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Delete Conversation'>
                <IconButton onClick={() => setOpenDeleteConversation(true)} color='error' sx={{ minWidth: '20px' }}>
                  <DeleteIcon sx={{ minWidth: '20px' }} />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          }
        >
          <MenuItem key='-' value='-'>
            - New Conversation -
          </MenuItem>
          {loaded &&
            state.overrides.conversationName !== '-' &&
            !conversationData?.includes(state.overrides.conversationName) && (
              <MenuItem key={state.overrides.conversationName} value={state.overrides.conversationName}>
                {state.overrides.conversationName}
              </MenuItem>
            )}
          {conversationData &&
            conversationData.map &&
            conversationData?.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          {/* 
              Workaround of a backend limitation - files only created (and rendered in conversation list) once they have messages.
              Thanks, I hate it too.
            
            {!conversationData?.includes(state.overrides.conversationName) && (
              <MenuItem key={state.overrides.conversationName} value={state.overrides.conversationName}>
                {state.overrides.conversationName}
              </MenuItem>
            )}
              */}
        </Select>
      </FormControl>

      <Dialog open={openDeleteConversation} onClose={() => setOpenDeleteConversation(false)}>
        <DialogTitle>Delete Conversation</DialogTitle>
        <DialogContent>
          <DialogContent>Are you sure you want to delete this conversation?</DialogContent>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConversation(false)} color='error'>
            Cancel
          </Button>
          <Button onClick={handleDeleteConversation} color='info'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openRenameConversation} onClose={() => setOpenRenameConversation(false)} disableRestoreFocus>
        <DialogTitle>Rename Conversation</DialogTitle>
        <DialogContent>
          <TextField
            margin='dense'
            id='name'
            label='New Conversation Name'
            type='text'
            fullWidth
            value={changedConversationName}
            onChange={(e) => setChangedConversationName(e.target.value)}
            variant='outlined'
            color='info'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRenameConversation(false)} color='error'>
            Cancel
          </Button>
          <Button onClick={() => handleRenameConversation()} color='info'>
            Rename
          </Button>
          <Button onClick={() => handleRenameConversation(true)} color='info'>
            Generate a Name
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

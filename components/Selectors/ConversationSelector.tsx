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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import React, { useContext, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { InteractiveConfigContext } from '../../types/InteractiveConfigContext';

export default function ConversationSelector(): React.JSX.Element {
  const state = useContext(InteractiveConfigContext);
  const theme = useTheme();
  const { data: conversationData } = useSWR<string[]>(
    `/conversation`,
    async () => (await state.agixt.getConversations()) as string[],
  );
  const { data: currentConversation } = useSWR(
    '/conversation/' + state.overrides.conversationName,
    async () => await state.agixt.getConversation('', state.overrides.conversationName, 100, 1),
    {
      fallbackData: [],
    },
  );
  const [openNewConversation, setOpenNewConversation] = useState(false);
  const [newConversationName, setNewConversationName] = useState('');
  // Make a confirmation dialog for deleting conversations
  const [openDeleteConversation, setOpenDeleteConversation] = useState(false);

  const handleAddConversation = async (): Promise<void> => {
    //console.log(state);
    if (newConversationName) {
      await state.agixt.newConversation(state.agent, newConversationName);
      setNewConversationName('');
      setOpenNewConversation(false);
      mutate('/conversation');
      state.mutate((oldState) => ({
        ...oldState,
        overrides: { ...oldState.overrides, conversationName: newConversationName },
      }));
    }
  };
  const handleDeleteConversation = async (): Promise<void> => {
    if (state.overrides.conversationName) {
      await state.agixt.deleteConversation(state.agent, state.overrides.conversationName);
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

  return (
    <>
      <Tooltip title='Select a Conversation'>
        <FormControl
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
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
            fullWidth
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
          >
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
            */}
            {!conversationData?.includes(state.overrides.conversationName) && (
              <MenuItem key={state.overrides.conversationName} value={state.overrides.conversationName}>
                {state.overrides.conversationName}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Tooltip>
      <Box width='40%' display='flex' justifyContent='center' gap='0.5rem' mx='0.5rem'>
        <Tooltip title='Add Conversation'>
          <Button variant='outlined' onClick={() => setOpenNewConversation(true)} color='info' sx={{ minWidth: '20px' }}>
            <AddIcon sx={{ minWidth: '20px' }} />
          </Button>
        </Tooltip>
        <Tooltip title='Export Conversation'>
          <Button variant='outlined' onClick={handleExportConversation} color='info' sx={{ minWidth: '20px' }}>
            <FileDownloadOutlinedIcon sx={{ minWidth: '20px' }} />
          </Button>
        </Tooltip>
        <Tooltip title='Delete Conversation'>
          <Button variant='outlined' onClick={() => setOpenDeleteConversation(true)} color='error' sx={{ minWidth: '20px' }}>
            <DeleteIcon sx={{ minWidth: '20px' }} />
          </Button>
        </Tooltip>
      </Box>
      <Dialog open={openNewConversation} onClose={() => setOpenNewConversation(false)} disableRestoreFocus>
        <DialogTitle>Create New Conversation</DialogTitle>
        <DialogContent>
          <TextField
            margin='dense'
            id='name'
            label='New Conversation Name'
            type='text'
            fullWidth
            value={newConversationName}
            onChange={(e) => setNewConversationName(e.target.value)}
            variant='outlined'
            color='info'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewConversation(false)} color='error'>
            Cancel
          </Button>
          <Button onClick={handleAddConversation} color='info'>
            Create
          </Button>
        </DialogActions>
      </Dialog>
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
    </>
  );
}

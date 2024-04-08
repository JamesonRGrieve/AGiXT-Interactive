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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import React, { useContext, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { ChatContext } from '../types/ChatContext';

export default function ConversationSelector(): React.JSX.Element {
  const state = useContext(ChatContext);
  const { data: conversationData } = useSWR<string[]>(
    `/conversation`,
    async () => (await state.sdk.getConversations()) as string[],
  );
  const { data: currentConversation } = useSWR(
    '/conversation/' + state.chatSettings.conversationName,
    async () => await state.sdk.getConversation('', state.chatSettings.conversationName, 100, 1),
    {
      fallbackData: [],
    },
  );
  const [openNewConversation, setOpenNewConversation] = useState(false);
  const [newConversationName, setNewConversationName] = useState('');
  // Make a confirmation dialog for deleting conversations
  const [openDeleteConversation, setOpenDeleteConversation] = useState(false);

  const handleAddConversation = async () => {
    if (!newConversationName) {
      return;
    }
    await state.sdk.newConversation(state.chatSettings.selectedAgent, newConversationName);
    setNewConversationName('');
    setOpenNewConversation(false);
    mutate('/conversation');
    state.mutate((oldState) => ({
      ...oldState,
      chatConfig: { ...oldState.chatConfig, conversationName: newConversationName },
      chatSettings: { ...oldState.chatSettings, conversationName: newConversationName },
    }));
  };
  const handleDeleteConversation = async () => {
    if (!state.chatSettings.conversationName) {
      return;
    }
    await state.sdk.deleteConversation(state.chatSettings.selectedAgent, state.chatSettings.conversationName);
    const updatedConversations = conversationData.filter((c) => c !== state.chatSettings.conversationName);
    state.mutate((oldState) => {
      return {
        ...oldState,
        conversation: updatedConversations,
        chatConfig: { ...oldState.chatConfig, conversationName: updatedConversations[0] || '' },
      };
    });
    setOpenDeleteConversation(false);
  };

  const handleExportConversation = async () => {
    if (state.chatSettings.conversationName) {
      const element = document.createElement('a');
      const file = new Blob([JSON.stringify(currentConversation)], {
        type: 'application/json',
      });
      element.href = URL.createObjectURL(file);
      element.download = `${state.chatSettings.conversationName}.json`;
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
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': { borderColor: '#CCC' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '.MuiSvgIcon-root ': {
                fill: 'white !important',
              },
              '.MuiOutlinedInput-notchedOutline legend span': {
                // Targeting the floating label specifically
                color: 'white',
                opacity: '1',
              },
              fontSize: '12px',
            }}
            fullWidth
            labelId='conversation-label'
            label='Select a Conversation'
            disabled={conversationData?.length === 0}
            value={state.chatSettings.conversationName}
            onChange={(e) =>
              state.mutate((oldState) => ({
                ...oldState,
                chatSettings: { ...oldState.chatSettings, conversationName: e.target.value },
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
            {!conversationData?.includes(state.chatSettings.conversationName) && (
              <MenuItem key={state.chatSettings.conversationName} value={state.chatSettings.conversationName}>
                {state.chatSettings.conversationName}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Tooltip>
      &nbsp;
      <Tooltip title='Add Conversation'>
        <Button variant='outlined' onClick={() => setOpenNewConversation(true)} color='info' sx={{ minWidth: '20px' }}>
          <AddIcon sx={{ minWidth: '20px' }} />
        </Button>
      </Tooltip>
      &nbsp;
      <Tooltip title='Export Conversation'>
        <Button variant='outlined' onClick={handleExportConversation} color='info' sx={{ minWidth: '20px' }}>
          <FileDownloadOutlinedIcon sx={{ minWidth: '20px' }} />
        </Button>
      </Tooltip>
      &nbsp;
      <Tooltip title='Delete Conversation'>
        <Button variant='outlined' onClick={() => setOpenDeleteConversation(true)} color='error' sx={{ minWidth: '20px' }}>
          <DeleteIcon sx={{ minWidth: '20px' }} />
        </Button>
      </Tooltip>
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
            autoFocus
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

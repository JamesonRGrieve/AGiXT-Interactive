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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useContext, useState } from 'react';
import { ChatContext } from '../../types/ChatContext';
import useSWR, { mutate } from 'swr';

export default function ConversationSelector() {
  const AGiXTState = useContext(ChatContext);
  const { data: conversationData } = useSWR(`/conversation`, async () => await AGiXTState.sdk.getConversations());
  const [openNewConversation, setOpenNewConversation] = useState(false);
  const [newConversationName, setNewConversationName] = useState('');
  // Make a confirmation dialog for deleting conversations
  const [openDeleteConversation, setOpenDeleteConversation] = useState(false);
  const state = useContext(ChatContext);
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
    if (!state.chatSettings.conversationName) {
      return;
    }
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(state.chatState.conversation)], {
      type: 'application/json',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${state.chatSettings.conversationName}.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
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
            }}
            fullWidth
            labelId='conversation-label'
            label='Select a Conversation'
            value={state.chatSettings.conversationName}
            onChange={(e) =>
              state.mutate((oldState) => ({
                ...oldState,
                chatConfig: { ...oldState.chatConfig, conversationName: e.target.value },
              }))
            }
          >
            {conversationData?.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Tooltip>
      <Tooltip title='Add Conversation'>
        <Button onClick={() => setOpenNewConversation(true)} color={'info'} sx={{ minWidth: '20px' }}>
          <AddIcon sx={{ minWidth: '20px' }} color={'info'} />
        </Button>
      </Tooltip>
      <Tooltip title='Export Conversation'>
        <Button onClick={handleExportConversation} color={'info'} sx={{ minWidth: '20px' }}>
          <FileDownloadOutlinedIcon sx={{ minWidth: '20px' }} color={'info'} />
        </Button>
      </Tooltip>
      <Tooltip title='Delete Conversation'>
        <Button onClick={() => setOpenDeleteConversation(true)} color={'error'} sx={{ minWidth: '20px' }}>
          <DeleteIcon sx={{ minWidth: '20px' }} color={'error'} />
        </Button>
      </Tooltip>
      <Dialog open={openNewConversation} onClose={() => setOpenNewConversation(false)}>
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

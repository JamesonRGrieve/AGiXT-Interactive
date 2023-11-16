import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useContext, useEffect, useState } from 'react';
import { AGiXTContext, AGiXTState } from '@/types/AGiXTContext';
import { setCookie } from 'cookies-next';
export default function ConversationSelector() {
  const AGiXTState = useContext(AGiXTContext) as AGiXTState;
  const [openNewConversation, setOpenNewConversation] = useState(false);
  const [newConversationName, setNewConversationName] = useState('');
  // Make a confirmation dialog for deleting conversations
  const [openDeleteConversation, setOpenDeleteConversation] = useState(false);
  useEffect(() => {
    console.log("Fetching Conversations!");
    (async () => {
      const newConversations = await AGiXTState.sdk.getConversations(AGiXTState.agentName);
      AGiXTState.mutate(oldState => {return { ...oldState, conversations: newConversations }});
      console.log("Fetched Conversations!");
    })();
  }, [AGiXTState.agentName, AGiXTState.sdk]);
  useEffect(() => {
    setCookie('conversationName', AGiXTState.conversationName);
  }, [AGiXTState.conversationName]);
  const handleAddConversation = async () => {
    if (!newConversationName) return;
    await AGiXTState.sdk.newConversation(AGiXTState.agentName, newConversationName);
    setNewConversationName('');
    setOpenNewConversation(false);
    const fetchConversations = async () => {
      const updatedConversations = await AGiXTState.sdk.getConversations();
      AGiXTState.mutate({ ...AGiXTState, conversations: updatedConversations });
    };
    fetchConversations();
    AGiXTState.mutate({ ...AGiXTState, conversationName: newConversationName });
  };
  const handleDeleteConversation = async () => {
    if (!AGiXTState.conversationName) return;
    await AGiXTState.sdk.deleteConversation(AGiXTState.agentName, AGiXTState.conversationName);
    const updatedConversations = AGiXTState.conversations.filter((c) => c !== AGiXTState.conversationName);
    AGiXTState.mutate({ ...AGiXTState, conversations: updatedConversations });
    AGiXTState.mutate({ ...AGiXTState, conversationName: updatedConversations[0] || '' });
    setOpenDeleteConversation(false);
  };

  const handleExportConversation = async () => {
    if (!AGiXTState.conversationName) return;
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(AGiXTState.conversation)], {
      type: 'application/json'
    });
    element.href = URL.createObjectURL(file);
    element.download = `${AGiXTState.conversationName}.json`;
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
            alignItems: 'center'
          }}
          fullWidth
        >
          <InputLabel id='conversation-label'>Select a Conversation</InputLabel>
          <Select
            fullWidth
            labelId='conversation-label'
            label='Select a Conversation'
            value={AGiXTState.conversationName}
            onChange={(e) => AGiXTState.mutate({ ...AGiXTState, conversationName: e.target.value })}
          >
            {AGiXTState.conversations
              ? AGiXTState.conversations.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))
              : null}
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

import React, { useContext, useEffect, useState } from 'react';
import { useTheme } from '@mui/material';

import {
  Paper,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Tooltip
} from '@mui/material';
import { ContentCopy as ContentCopyIcon, Download as DownloadIcon, ThumbUp, ThumbDown } from '@mui/icons-material';
import clipboardCopy from 'clipboard-copy';

import MarkdownBlock from './MarkdownBlock';
import { AGiXTContext, AGiXTState } from '@/types/AGiXTContext';
const WAIT_MESSAGE = 'Let me think about that for a moment. Please wait..';

export default function ConversationHistory() {
  let lastUserMessage = ''; // track the last user message
  const AGiXTState = useContext(AGiXTContext) as AGiXTState;
  useEffect(() => {
    const fetchConversation = async () => {
      const convo = await AGiXTState.sdk.getConversation(AGiXTState.agentName, AGiXTState.conversationName, 100, 1);
      AGiXTState.mutate((oldState) => {
        return { ...oldState, conversation: convo };
      });
    };
    fetchConversation();
  }, [AGiXTState.conversationName, AGiXTState.lastResponse, AGiXTState.agentName, AGiXTState.sdk]);
  return (
    <Paper
      elevation={5}
      sx={{
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
        flexGrow: '1'
      }}>
      <div>
        {AGiXTState.conversation
          ? AGiXTState.conversation.map((chatItem, index) => {
              if (chatItem.role === 'USER') {
                lastUserMessage = chatItem.message;
              }
              return (
                <ChatMessage
                  key={index}
                  chatItem={chatItem}
                  isLoading={AGiXTState.isLoading}
                  sdk={AGiXTState.sdk}
                  lastUserMessage={lastUserMessage}
                />
              );
            })
          : null}
        {AGiXTState.isLoading && (
          <>
            <ChatMessage
              key={'Please Wait'}
              chatItem={{
                role: AGiXTState.agentName,
                message: WAIT_MESSAGE,
                timestamp: 'Just Now...'
              }}
              isLoading={AGiXTState.isLoading}
              lastUserMessage={lastUserMessage}
              sdk={AGiXTState.sdk}
            />
          </>
        )}
      </div>
    </Paper>
  );
}

const ChatMessage = ({ chatItem, lastUserMessage, isLoading, sdk }) => {
  const formattedMessage =
    typeof chatItem.message === 'string'
      ? chatItem.message.replace(/\\n/g, '  \n').replace(/\n/g, '  \n')
      : chatItem.message;
  const theme = useTheme();
  const [vote, setVote] = useState(0);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleClickOpen = (newVote) => {
    setVote(newVote);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCopyClick = () => {
    clipboardCopy(formattedMessage);
  };
  const handleDownloadClick = () => {
    const element = document.createElement('a');
    const file = new Blob([formattedMessage], {
      type: 'text/plain;charset=utf-8'
    });
    element.href = URL.createObjectURL(file);
    element.download = `${chatItem.role}-${chatItem.timestamp}.txt`;
    document.body.appendChild(element);
    element.click();
  };
  console.log("Theme from AGiXT", theme);
  return (
    <Box
      sx={{
        backgroundColor: chatItem.role === 'USER' ? theme.palette.background.default : theme.palette.action.selected
      }}>
      <Box
        sx={{
          padding: '10px',
          overflow: 'hidden',
          position: 'center'
        }}>
        <MarkdownBlock content={formattedMessage} chatItem={chatItem} />
        <Typography
          variant='caption'
          style={{
            color: theme.palette.text.secondary,
            width: '100%',
            display: 'inline-block'
          }}>
          {chatItem.role === 'USER' ? 'You' : chatItem.role} • {chatItem.timestamp}
        </Typography>
        {chatItem.role != 'USER' && !isLoading && (
          <>
            <Tooltip title='Provide Positive Feedback'>
              <IconButton onClick={() => handleClickOpen(1)}>
                <ThumbUp color={vote === 1 ? 'success' : 'inherit'} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Provide Negative Feedback'>
              <IconButton onClick={() => handleClickOpen(-1)}>
                <ThumbDown color={vote === -1 ? 'error' : 'inherit'} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Copy Message'>
              <IconButton onClick={handleCopyClick}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Download Message'>
              <IconButton onClick={handleDownloadClick}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
        <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
          <DialogTitle id='form-dialog-title'>Provide Feedback</DialogTitle>
          <DialogContent>
            <DialogContentText>Please provide some feedback regarding the message.</DialogContentText>
            <TextField
              margin='dense'
              id='name'
              label='Feedback'
              type='text'
              fullWidth
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              color='info'
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='error'>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const messageText = `User Feedback: ${feedback} \n\n Message: ${chatItem.message} \n\n Last User Message: ${lastUserMessage}`;
                handleClose();
                if (vote === 1) {
                  sdk.learnText(chatItem.role, lastUserMessage, messageText, 2);
                } else {
                  sdk.learnText(chatItem.role, lastUserMessage, messageText, 3);
                }
              }}
              color='info'>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

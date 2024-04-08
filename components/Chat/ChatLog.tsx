'use client';
import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import AudioPlayer from 'jrgcomponents/Media/AudioPlayer';
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
  Tooltip,
  useTheme,
} from '@mui/material';
import { ContentCopy as ContentCopyIcon, Download as DownloadIcon, ThumbUp, ThumbDown } from '@mui/icons-material';
import clipboardCopy from 'clipboard-copy';

import { ChatContext } from '../../types/ChatContext';
import MarkdownBlock from '../MarkdownBlock';
function formatDate(timestamp: string) {
  // Create a date object from the timestamp
  const date = new Date(timestamp);

  // Convert the date to the server timezone
  const serverDate = new Date(date.toLocaleString('en-US', { timeZone: process.env.NEXT_PUBLIC_TZ.replace('TZ-', '') }));

  // Calculate the time difference between the server date and the original date
  const timeDifference = date.getTime() - serverDate.getTime();

  // Create a new date object that represents the local time
  const localDate = new Date(date.getTime() + timeDifference);

  // Format the local date
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return localDate.toLocaleString('en-US', options);
}

export default function ConversationHistory({ conversation, latestMessage, alternateBackground }): React.JSX.Element {
  let lastUserMessage = ''; // track the last user message
  const state = useContext(ChatContext);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  useEffect(() => {
    // console.log('Conversation mutated, scrolling to bottom.', state.chatSettings.conversationName, conversation);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  return (
    <Paper
      elevation={5}
      sx={{
        display: 'flex',
        flexDirection: 'column-reverse',
        overflowY: 'scroll',
        flexGrow: '1',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box display='flex' flexDirection='column' sx={{ overflowY: 'auto' }}>
        {conversation.length > 0 && conversation.map ? (
          conversation.map((chatItem, index) => {
            if (chatItem.role === 'USER') {
              lastUserMessage = chatItem.message;
            }
            return <ChatMessage key={index} chatItem={chatItem} lastUserMessage={lastUserMessage} />;
          })
        ) : (
          <Box pt='2rem' pb='3rem'>
            <Typography variant='h1' align='center'>
              Welcome to {process.env.NEXT_PUBLIC_APP_NAME}
            </Typography>
            <Typography variant='subtitle1' align='center' mb='2rem'>
              {process.env.NEXT_PUBLIC_APP_DESCRIPTION}
            </Typography>
            <Typography variant='body1' align='center'>
              {process.env.NEXT_PUBLIC_APP_NAME} may provide inaccurate or inappropriate responses, may break character and
              comes with no warranty of any kind. By using this software you agree to hold harmless the developers of{' '}
              {process.env.NEXT_PUBLIC_APP_NAME} for any damages caused by the use of this software.
            </Typography>
          </Box>
        )}
        {latestMessage && (
          <>
            <ChatMessage
              key={'Please Wait User'}
              chatItem={{
                role: 'USER',
                message: latestMessage,
                timestamp: undefined,
              }}
              lastUserMessage={null}
              alternateBackground={alternateBackground}
            />
            <ChatMessage
              key={'Please Wait Agent'}
              chatItem={{
                role: state.chatSettings.selectedAgent,
                message: state.chatSettings.selectedAgent + ' is typing...',
                timestamp: '',
              }}
              lastUserMessage={null}
              alternateBackground={alternateBackground}
            />
          </>
        )}
        <div ref={messagesEndRef} />
      </Box>
    </Paper>
  );
}

const ChatMessage = ({ chatItem, lastUserMessage, alternateBackground = 'primary' }): React.JSX.Element => {
  const state = useContext(ChatContext);
  const formattedMessage = useMemo(() => {
    const toFormat =
      typeof chatItem.message !== 'string'
        ? 'An audio message'
        : chatItem.message.includes('#GENERATED_AUDIO:')
          ? chatItem.message.split('#GENERATED_AUDIO:')[0]
          : chatItem.message;
    let formatted = toFormat;
    try {
      const parsed = JSON.parse(toFormat);
      formatted = parsed.text || toFormat;
    } catch (e) {
      formatted = toFormat.replace(/\\n/g, '  \n').replace(/\n/g, '  \n');
    }
    // if (chatItem.message.includes('#GENERATED_AUDIO:')) console.log('Formatted: ', formatted);
    return formatted;
  }, [chatItem]);

  const audio = useMemo(() => {
    // console.log('Audio: ', theAudio);
    return typeof chatItem.message !== 'string'
      ? 'An audio message'
      : chatItem.message.includes('#GENERATED_AUDIO:')
        ? chatItem.message.split('#GENERATED_AUDIO:')[1]
        : null;
  }, [chatItem]);
  const [vote, setVote] = useState(0);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const theme = useTheme();
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
      type: 'text/plain;charset=utf-8',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${chatItem.role}-${chatItem.timestamp}.txt`;
    document.body.appendChild(element);
    element.click();
  };
  return (
    <Box
      sx={{
        backgroundColor:
          chatItem.role === 'USER'
            ? theme.palette.background.default
            : theme.palette[alternateBackground][theme.palette.mode],
        padding: '10px',
        overflow: 'hidden',
        position: 'center',
        color: theme.palette.text.primary,
      }}
    >
      <MarkdownBlock content={formattedMessage} chatItem={chatItem} />
      {audio && <AudioPlayer base64audio={audio} />}
      {chatItem.timestamp !== '' && (
        <Typography
          variant='caption'
          style={{
            width: '100%',
            display: 'inline-block',
          }}
        >
          <b>{chatItem.role === 'USER' ? 'You' : chatItem.role}</b> •{' '}
          {chatItem.timestamp === undefined ? 'Just Now...' : formatDate(new Date(chatItem.timestamp))}
        </Typography>
      )}
      {chatItem.role !== 'USER' && !lastUserMessage && (
        <>
          {process.env.NEXT_PUBLIC_AGIXT_RLHF === 'true' && (
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
            </>
          )}
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
                state.sdk.learnText(chatItem.role, lastUserMessage, messageText, 2);
              } else {
                state.sdk.learnText(chatItem.role, lastUserMessage, messageText, 3);
              }
            }}
            color='info'
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

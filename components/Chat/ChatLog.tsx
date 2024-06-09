'use client';
import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
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
import { InteractiveConfigContext } from '../../types/InteractiveConfigContext';
import MarkdownBlock from '../MarkdownBlock';
import ChatActivity from './ChatActivity';

function formatDate(timestamp: string): string {
  // Create a date object from the timestamp
  const date = new Date(timestamp);

  // Convert the date to the server timezone
  const serverDate = new Date(
    date.toLocaleString('en-US', {
      timeZone: process.env.NEXT_PUBLIC_TZ ? process.env.NEXT_PUBLIC_TZ.replace('TZ-', '') : '',
    }),
  );

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

export default function ChatLog({
  conversation,
  alternateBackground,
}: {
  conversation: { role: string; message: string; timestamp: string }[];
  alternateBackground?: string;
}): React.JSX.Element {
  let lastUserMessage = ''; // track the last user message
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  console.log(conversation);
  useEffect(() => {
    // console.log('Conversation mutated, scrolling to bottom.', state.overrides.conversationName, conversation);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  return (
    <Paper
      elevation={5}
      sx={{
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: '1 1 0',
        flexGrow: '1',
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
      }}
    >
      <Box display='flex' minHeight='min-content' flexDirection='column'>
        {conversation.length > 0 && conversation.map ? (
          conversation.map((chatItem, index: number) => {
            if (chatItem.role === 'USER') {
              lastUserMessage = chatItem.message;
            }
            const messageType = chatItem.message.split(' ')[0];
            const messageBody = ['[ACTIVITY]', '[ACTIVITY][ERROR]'].includes(messageType)
              ? chatItem.message.substring(chatItem.message.indexOf(' '))
              : chatItem.message;
            // TODO Fix this so the timestamp works. It's not granular enough rn and we get duplicates.
            return ['[ACTIVITY]', '[ACTIVITY][ERROR]'].includes(messageType) ? (
              <ChatActivity
                key={chatItem.timestamp + '-' + messageBody}
                error={messageType === '[ACTIVITY][ERROR]'}
                inProgress={index === conversation.length - 1}
                message={messageBody}
                alternateBackground={alternateBackground}
              />
            ) : (
              <ChatMessage
                key={chatItem.timestamp + '-' + messageBody}
                chatItem={chatItem}
                lastUserMessage={lastUserMessage}
              />
            );
          })
        ) : (
          <Box pt='2rem' pb='3rem'>
            <Typography variant='h1' align='center'>
              Welcome to {process.env.NEXT_PUBLIC_APP_NAME}
            </Typography>
            <Typography variant='subtitle1' align='center' mb='2rem'>
              {process.env.NEXT_PUBLIC_APP_DESCRIPTION}
            </Typography>
            <Typography variant='body1' align='center' px='2rem'>
              {process.env.NEXT_PUBLIC_APP_NAME} may provide inaccurate or inappropriate responses, may break character and
              comes with no warranty of any kind. By using this software you agree to hold harmless the developers of{' '}
              {process.env.NEXT_PUBLIC_APP_NAME} for any damages caused by the use of this software.
            </Typography>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>
    </Paper>
  );
}

const generatedAudioString = '#GENERATED_AUDIO:';
const ChatMessage = ({ chatItem, lastUserMessage, alternateBackground = 'primary' }): React.JSX.Element => {
  const state = useContext(InteractiveConfigContext);
  const formattedMessage = useMemo(() => {
    const toFormat =
      typeof chatItem.message !== 'string'
        ? '*An audio message.*'
        : chatItem.message.includes(generatedAudioString)
          ? chatItem.message.split(generatedAudioString)[0]
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
  const audios = useMemo(() => {
    if (
      chatItem?.message &&
      typeof chatItem.message === 'string' &&
      chatItem.message.includes('<audio controls><source src=')
    ) {
      // Replace the html audio control with a link to the audio
      const matches = [...chatItem.message.matchAll(/<audio controls><source src="(.*?)" type="audio\/wav"><\/audio>/g)];
      const audioSrcs = matches.map((match) => match[1]);
      // We can reformat it any way we want for testing like this.
      return {
        message: chatItem.message.replaceAll(/<audio controls><source src="(.*?)" type="audio\/wav"><\/audio>/g, ''),
        srcs: audioSrcs,
      };
    } else return null;

    // console.log('Audio: ', theAudio);
    /*
    return typeof chatItem.message !== 'string'
      ? 'An audio message'
      : chatItem.message.includes(generatedAudioString)
        ? chatItem.message.split(generatedAudioString)[1]
        : null;
        */
  }, [chatItem]);
  const [vote, setVote] = useState(chatItem.rlhf ? (chatItem.rlhf.positive ? 1 : -1) : 0);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor:
          chatItem.role === 'USER'
            ? theme.palette.background.default
            : theme.palette[String(alternateBackground)][theme.palette.mode],
        padding: '10px',
        overflow: 'hidden',
        position: 'center',
        color: theme.palette.text.primary,
      }}
    >
      {audios?.srcs?.length > 0 ? (
        <>
          <MarkdownBlock content={formattedMessage} chatItem={{ ...chatItem, message: audios.message }} />
          {audios.srcs.map((src) => (
            <audio controls key={src}>
              <source src={src} type='audio/wav' />
            </audio>
          ))}
        </>
      ) : (
        <MarkdownBlock content={formattedMessage} chatItem={chatItem} />
      )}

      {chatItem.timestamp !== '' && (
        <Typography
          variant='caption'
          style={{
            width: '100%',
            display: 'inline-block',
          }}
        >
          <b>{chatItem.role === 'USER' ? 'You' : chatItem.role}</b> •{' '}
          {chatItem.timestamp === undefined ? 'Just Now...' : formatDate(chatItem.timestamp)}
        </Typography>
      )}
      {chatItem.role !== 'USER' && (
        <>
          {process.env.NEXT_PUBLIC_AGIXT_RLHF === 'true' && (
            <>
              <Tooltip title='Provide Positive Feedback'>
                <IconButton
                  onClick={() => {
                    setVote(1);
                    setOpen(true);
                  }}
                >
                  <ThumbUp color={vote === 1 ? 'success' : 'inherit'} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Provide Negative Feedback'>
                <IconButton
                  onClick={() => {
                    setVote(-1);
                    setOpen(true);
                  }}
                >
                  <ThumbDown color={vote === -1 ? 'error' : 'inherit'} />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title='Copy Message'>
            <IconButton
              onClick={() => {
                clipboardCopy(formattedMessage);
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Download Message'>
            <IconButton
              onClick={() => {
                const element = document.createElement('a');
                const file = new Blob([formattedMessage], {
                  type: 'text/plain;charset=utf-8',
                });
                element.href = URL.createObjectURL(file);
                element.download = `${chatItem.role}-${chatItem.timestamp}.txt`;
                document.body.appendChild(element);
                element.click();
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          {chatItem.rlhf && (
            <Typography variant='caption' color={chatItem.rlhf.positive ? 'success' : 'error'}>
              {chatItem.rlhf.feedback}
            </Typography>
          )}
        </>
      )}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby='form-dialog-title'
      >
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
          <Button
            onClick={() => {
              setOpen(false);
            }}
            color='error'
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              if (vote === 1) {
                state.agixt.addConversationFeedback(
                  true,
                  chatItem.role,
                  chatItem.message,
                  lastUserMessage,
                  feedback,
                  state.overrides.conversationName,
                );
              } else {
                state.agixt.addConversationFeedback(
                  false,
                  chatItem.role,
                  chatItem.message,
                  lastUserMessage,
                  feedback,
                  state.overrides.conversationName,
                );
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

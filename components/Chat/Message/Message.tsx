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
import {
  ContentCopy as ContentCopyIcon,
  Download as DownloadIcon,
  ThumbUp,
  ThumbDown,
  EditNote,
  DeleteForever,
} from '@mui/icons-material';
import clipboardCopy from 'clipboard-copy';
import { InteractiveConfigContext } from '../../../types/InteractiveConfigContext';
import MarkdownBlock from './MarkdownBlock';
import formatDate from './formatDate';

export type MessageProps = {
  chatItem: { role: string; message: string; timestamp: string; rlhf?: { positive: boolean; feedback: string } };
  lastUserMessage: string;
  alternateBackground?: string;
  setLoading: (loading: boolean) => void;
};
export default function Message({
  chatItem,
  lastUserMessage,
  alternateBackground = 'primary',
  setLoading,
}: MessageProps): React.JSX.Element {
  const state = useContext(InteractiveConfigContext);
  const formattedMessage = useMemo(() => {
    let formatted = chatItem.message;
    try {
      const parsed = JSON.parse(chatItem.message);
      formatted = (parsed.text || chatItem.message).replace('\\n', '\n');
    } catch (e) {
      // console.error(e);
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
      const audioSources = matches.map((match) => match[1]);
      // We can reformat it any way we want for testing like this.
      return {
        message: chatItem.message.replaceAll(/<audio controls><source src="(.*?)" type="audio\/wav"><\/audio>/g, ''),
        sources: audioSources,
      };
    } else {
      return null;
    }
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
      {audios?.sources?.length > 0 ? (
        <>
          {audios?.message?.trim() && (
            <MarkdownBlock
              content={formattedMessage}
              chatItem={{ ...chatItem, message: audios.message }}
              setLoading={setLoading}
            />
          )}
          {audios.sources.map((src) => (
            <audio controls key={src}>
              <source src={src} type='audio/wav' />
              <track kind='captions' />
            </audio>
          ))}
        </>
      ) : (
        <MarkdownBlock content={formattedMessage} chatItem={chatItem} setLoading={setLoading} />
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
          <Tooltip title={formatDate(chatItem.timestamp, false)}>
            <span>{chatItem.timestamp === undefined ? 'Just Now...' : formatDate(chatItem.timestamp)}</span>
          </Tooltip>
        </Typography>
      )}
      {(audios?.message?.trim() || !audios) && (
        <>
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
          <Tooltip title='Edit Message'>
            <IconButton disabled>
              <EditNote />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete Message'>
            <IconButton disabled>
              <DeleteForever />
            </IconButton>
          </Tooltip>
          {chatItem.rlhf && (
            <Typography variant='caption' color={chatItem.rlhf.positive ? 'success' : 'error'}>
              {chatItem.rlhf.feedback}
            </Typography>
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
        </>
      )}
    </Box>
  );
}

import { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import { Mic as MicIcon, Cancel as CancelIcon, Send as SendIcon } from '@mui/icons-material';
import { mutate } from 'swr';
import { ChatContext } from '../../../types/ChatContext';

export default function AudioRecorder({ recording, setRecording, disabled }): React.JSX.Element {
  const state = useContext(ChatContext);
  const [audioData, setAudioData] = useState(null);
  const mediaRecorder = useRef(null);
  const theme = useTheme();
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => {
          setAudioData(event.data);
        };
        mediaRecorder.current.start();
        setRecording(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const finishRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  const sendAudio = useCallback(() => {
    if (audioData) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(audioData); // Use ArrayBuffer for raw binary data
      reader.onloadend = () => {
        const audioDataArray = new Uint8Array(reader.result as ArrayBufferLike);
        const base64Audio = btoa(String.fromCharCode.apply(null, audioDataArray)); // Convert to base64
        const response = state.sdk
          .executeCommand(
            state.chatSettings.selectedAgent,
            'Prompt with Voice',
            {
              base64_audio: base64Audio,
              conversation_results: state.chatSettings.conversationResults,
              context_results: state.chatSettings.contextResults,
            },
            state.chatSettings.conversationName,
          )
          .then(() => {
            mutate('/conversation/' + state.chatSettings.conversationName);
          });
        setAudioData(null);
      };
    }
  }, [audioData, state]);

  useEffect(() => {
    if (audioData) {
      sendAudio();
    }
  }, [audioData, sendAudio]);

  const cancelRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
      setAudioData(null);
      state.mutate((oldState) => {
        return {
          ...oldState,
          chatState: { ...oldState.chatState, isLoading: false },
        };
      });
    }
  };

  return !recording ? (
    <Tooltip title='Record Audio'>
      <IconButton color='primary' disabled={disabled} onClick={startRecording}>
        <MicIcon />
      </IconButton>
    </Tooltip>
  ) : (
    <>
      <Tooltip title='Cancel Recording'>
        <IconButton color='error' onClick={cancelRecording}>
          <CancelIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Send Audio'>
        {/* Finish recording triggers data as soon as audio data is available */}
        <IconButton color='primary' onClick={finishRecording}>
          <SendIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}

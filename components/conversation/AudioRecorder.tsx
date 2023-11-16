import { useState, useRef, useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Mic as MicIcon, Cancel as CancelIcon, Send as SendIcon } from '@mui/icons-material';
import { AGiXTContext, AGiXTState } from '@/types/AGiXTContext';

export default function AudioRecorder({ conversationName, contextResults, conversationResults, agentName, sdk }) {
  const [recording, setRecording] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const mediaRecorder = useRef(null);
  const AGiXTState = useContext(AGiXTContext) as AGiXTState;

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/mp4'
      });
      mediaRecorder.current.ondataavailable = (event) => {
        setAudioData(event.data);
      };
      mediaRecorder.current.start();
      setRecording(true);
      AGiXTState.mutate({ ...AGiXTState, isLoading: true });
    });
  };

  const sendAudio = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
    }

    if (audioData) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(audioData); // Use ArrayBuffer for raw binary data
      reader.onloadend = () => {
        const audioDataArray = new Uint8Array(reader.result as ArrayBufferLike);
        const base64Audio = btoa(String.fromCharCode.apply(null, audioDataArray)); // Convert to base64
        const response = sdk.executeCommand(
          agentName,
          'Chat with Voice',
          {
            base64_audio: base64Audio,
            conversation_results: conversationResults,
            context_results: contextResults
          },
          conversationName
        );
        setAudioData(null);
      };
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
      AGiXTState.mutate({ ...AGiXTState, isLoading: false });
      setAudioData(null);
    }
  };

  return (
    <div>
      {!recording ? (
        <Tooltip title='Record Audio'>
          <IconButton color='info' onClick={startRecording}>
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
            <IconButton color='info' onClick={sendAudio}>
              <SendIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </div>
  );
}

import { useState, useRef, useCallback } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Mic as MicIcon, Cancel as CancelIcon, Send as SendIcon, Add } from '@mui/icons-material';

export default function AudioRecorder({
  recording,
  setRecording,
  disabled,
  onSave,
}: {
  recording: boolean;
  setRecording: (recording: boolean) => void;
  disabled: boolean;
  onSave: (message: string | object, uploadedFiles?: { [x: string]: string }) => void;
}): React.JSX.Element {
  const [audioData, setAudioData] = useState(null);
  const mediaRecorder = useRef(null);
  const startRecording = (): void => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event): void => {
          setAudioData(event.data);
        };
        mediaRecorder.current.start();
        setRecording(true);
        return true;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  };

  const finishRecording = (): void => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
    }
    sendAudio();
  };

  const sendAudio = useCallback(() => {
    if (audioData) {
      const reader = new FileReader();
      reader.readAsDataURL(audioData); // Use readAsDataURL for base64 conversion
      reader.onloadend = (): void => {
        setAudioData(null);
        onSave(reader.result as string); // Format looks like: data:audio/webm;codecs=opus;base64,GkXfo59ChoEBQveBAU...
      };
    }
  }, [audioData, onSave]);

  const cancelRecording = (): void => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
      setAudioData(null);
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
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
      <Tooltip title='Add Audio to Message'>
        {/* Finish recording triggers data as soon as audio data is available */}
        <IconButton color='primary' onClick={finishRecording}>
          <Add />
        </IconButton>
      </Tooltip>
    </>
  );
}

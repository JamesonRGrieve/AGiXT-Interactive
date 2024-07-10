import { useState, useRef, useCallback } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Mic, Cancel, Add, DeleteForever, Check } from '@mui/icons-material';

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
  const [save, setSave] = useState(false);
  const mediaRecorder = useRef(null);
  const startRecording = useCallback((): void => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event): void => {
          setRecording(false);
          console.log('Media available: ', event);
          const reader = new FileReader();
          reader.readAsDataURL(event.data);
          reader.onloadend = (): void => {
            setAudioData(reader.result);
          };
        };
        mediaRecorder.current.start();
        setRecording(true);
        return true;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }, [save, setRecording]);

  const finishRecording = useCallback((): void => {
    setSave(true);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
    }
  }, []);

  const cancelRecording = useCallback((): void => {
    setSave(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
      setAudioData(null);
    }
  }, []);

  return !recording ? (
    audioData && save ? (
      <>
        <IconButton
          color='error'
          onClick={() => {
            setAudioData(null);
          }}
        >
          <DeleteForever />
        </IconButton>
        <IconButton
          color='primary'
          onClick={() => {
            onSave(audioData);
            setAudioData(null);
          }}
        >
          <Add />
        </IconButton>
      </>
    ) : (
      <Tooltip title='Record Audio'>
        <IconButton color='primary' disabled={disabled} onClick={startRecording}>
          <Mic />
        </IconButton>
      </Tooltip>
    )
  ) : (
    <>
      <Tooltip title='Cancel Recording'>
        <IconButton color='error' onClick={cancelRecording}>
          <Cancel />
        </IconButton>
      </Tooltip>
      <Tooltip title='Finish Recording'>
        {/* Finish recording triggers data as soon as audio data is available */}
        <IconButton color='primary' onClick={finishRecording}>
          <Check />
        </IconButton>
      </Tooltip>
    </>
  );
}

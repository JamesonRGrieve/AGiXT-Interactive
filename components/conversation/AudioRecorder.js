import { useState, useRef } from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  Mic as MicIcon,
  Cancel as CancelIcon,
  Send as SendIcon,
} from "@mui/icons-material";

export default function AudioRecorder({
  conversationName,
  contextResults,
  conversationResults,
  setIsLoading,
  agentName,
  sdk,
}) {
  const [recording, setRecording] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const mediaRecorder = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        setAudioData(event.data);
      };
      mediaRecorder.current.start();
      setRecording(true);
      setIsLoading(true);
    });
  };

  const sendAudio = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop(); // Stop the recording when sending
      setRecording(false);
    }

    if (audioData) {
      const reader = new FileReader();
      reader.readAsDataURL(audioData);
      reader.onloadend = () => {
        const base64Audio = reader.result.split(",")[1];
        const response = sdk.executeCommand(
          agentName,
          "Chat with Voice",
          {
            base64_audio: base64Audio,
            conversation_results: conversationResults,
            context_results: contextResults,
          },
          conversationName
        );
        const base64TTS = response.replace("#GENERATED_AUDIO:", "");
        const audio = new Audio(base64TTS);
        audio.play();
        setAudioData(null); // Clear the audio data after sending
      };
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
      setIsLoading(false);
      setAudioData(null);
    }
  };

  return (
    <div>
      {!recording ? (
        <Tooltip title="Record Audio">
          <IconButton color="info" onClick={startRecording}>
            <MicIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title="Cancel Recording">
            <IconButton color="error" onClick={cancelRecording}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Send Audio">
            <IconButton color="info" onClick={sendAudio}>
              <SendIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
import {
  Mic as MicIcon,
  Cancel as CancelIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { sdk } from "../../../lib/apiClient";

export default function AudioRecorder({ conversationName }) {
  const [recording, setRecording] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const mediaRecorder = useRef(null);
  const router = useRouter();
  const agentName = router.query.agent;

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        setAudioData(event.data);
      };
      mediaRecorder.current.start();
      setRecording(true);
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
        sdk.executeCommand(
          agentName,
          "Transcribe Base64 Audio",
          {
            base64_audio: base64Audio,
          },
          conversationName
        );
        setAudioData(null); // Clear the audio data after sending
      };
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
      setAudioData(null);
    }
  };

  return (
    <div>
      {!recording ? (
        <IconButton color="info" onClick={startRecording}>
          <MicIcon />
        </IconButton>
      ) : (
        <>
          <IconButton color="error" onClick={cancelRecording}>
            <CancelIcon />
          </IconButton>
          <IconButton color="info" onClick={sendAudio}>
            <SendIcon />
          </IconButton>
        </>
      )}
    </div>
  );
}

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LuMic as Mic, LuSquare as Square } from 'react-icons/lu';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface VoiceRecorderProps {
  onSend: (message: string | object, uploadedFiles?: { [x: string]: string }) => Promise<void>;
  disabled: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSend, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const animationFrame = useRef<number>();
  const audioChunks = useRef<Float32Array[]>([]);
  const processorNode = useRef<ScriptProcessorNode | null>(null);
  const [ptt, setPtt] = useState(false);
  // Move stopRecording above detectSilence
  const stopRecording = useCallback(() => {
    if (!audioContext.current || !processorNode.current) return;

    // Stop recording
    processorNode.current.disconnect();
    analyser.current?.disconnect();

    // Convert to WAV
    const audioData = concatenateAudioBuffers(audioChunks.current, audioContext.current.sampleRate);
    const wavBlob = createWavBlob(audioData, audioContext.current.sampleRate);

    // Convert to base64 and send
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result as string;
      onSend('', {
        'recording.wav': base64Audio,
      });
    };
    reader.readAsDataURL(wavBlob);

    // Cleanup
    audioContext.current.close();
    audioContext.current = null;
    audioChunks.current = [];
    analyser.current = null;
    processorNode.current = null;

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = undefined;
    }

    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }

    setIsRecording(false);
  }, [onSend]);

  const detectSilence = useCallback(
    (dataArray: Uint8Array) => {
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / dataArray.length;

      if (average < 5) {
        if (silenceTimer.current === null) {
          silenceTimer.current = setTimeout(() => {
            stopRecording();
          }, 1000);
        }
      } else {
        if (silenceTimer.current) {
          clearTimeout(silenceTimer.current);
          silenceTimer.current = null;
        }
      }
    },
    [stopRecording],
  );

  const analyzeAudio = useCallback(() => {
    if (!analyser.current) return;

    const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
    analyser.current.getByteFrequencyData(dataArray);
    detectSilence(dataArray);

    animationFrame.current = requestAnimationFrame(analyzeAudio);
  }, [detectSilence]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioContext.current = new AudioContext({ sampleRate: 16000 });
      const source = audioContext.current.createMediaStreamSource(stream);
      analyser.current = audioContext.current.createAnalyser();
      processorNode.current = audioContext.current.createScriptProcessor(4096, 1, 1);

      source.connect(analyser.current);
      analyser.current.connect(processorNode.current);
      processorNode.current.connect(audioContext.current.destination);

      audioChunks.current = [];

      processorNode.current.onaudioprocess = (e) => {
        const channelData = e.inputBuffer.getChannelData(0);
        if (channelData.length > 0) {
          const buffer = new Float32Array(channelData.length);
          buffer.set(channelData);
          audioChunks.current.push(buffer);
        }
      };

      setIsRecording(true);
      if (!ptt) {
        animationFrame.current = requestAnimationFrame(analyzeAudio);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, [analyzeAudio, ptt]);

  // Create WAV file from audio buffer
  const createWavBlob = (audioData: Float32Array, sampleRate: number): Blob => {
    const buffer = new ArrayBuffer(44 + audioData.length * 2);
    const view = new DataView(buffer);

    // Write WAV header
    // "RIFF" identifier
    writeString(view, 0, 'RIFF');
    // File size
    view.setUint32(4, 36 + audioData.length * 2, true);
    // "WAVE" identifier
    writeString(view, 8, 'WAVE');
    // "fmt " chunk descriptor
    writeString(view, 12, 'fmt ');
    // Chunk size
    view.setUint32(16, 16, true);
    // Audio format (1 for PCM)
    view.setUint16(20, 1, true);
    // Number of channels
    view.setUint16(22, 1, true);
    // Sample rate
    view.setUint32(24, sampleRate, true);
    // Byte rate
    view.setUint32(28, sampleRate * 2, true);
    // Block align
    view.setUint16(32, 2, true);
    // Bits per sample
    view.setUint16(34, 16, true);
    // "data" chunk descriptor
    writeString(view, 36, 'data');
    // Data chunk size
    view.setUint32(40, audioData.length * 2, true);

    // Write audio data
    const length = audioData.length;
    const index = 44;
    const volume = 1;
    for (let i = 0; i < length; i++) {
      view.setInt16(index + i * 2, audioData[i] * 0x7fff * volume, true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
  };

  const writeString = (view: DataView, offset: number, string: string): void => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const concatenateAudioBuffers = (buffers: Float32Array[], sampleRate: number): Float32Array => {
    const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
    const result = new Float32Array(totalLength);
    let offset = 0;
    for (const buffer of buffers) {
      result.set(buffer, offset);
      offset += buffer.length;
    }
    return result;
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if both Left Ctrl and Backquote are currently pressed
      if (event.getModifierState('Control') && event.code === 'Backquote' && !isRecording && !event.repeat) {
        console.log('Starting recording...');
        setPtt(true);
        startRecording();
      }
    },
    [isRecording, startRecording],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      // Stop recording when either key is released
      if (['ControlLeft', 'Backquote'].includes(event.code) && ptt) {
        console.log('Stopping recording...');
        stopRecording();
        setPtt(false);
      }
    },
    [ptt, stopRecording],
  );
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
        silenceTimer.current = null;
      }
    };
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          className={cn(
            'transition-all duration-300 ease-in-out rounded-full',
            isRecording ? 'w-10 bg-red-500 hover:bg-red-600' : 'w-10',
          )}
          size='icon'
          variant='ghost'
        >
          {isRecording ? <Square className='w-5 h-5' /> : <Mic className='w-5 h-5' />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isRecording ? 'Stop recording' : 'Start recording'}</TooltipContent>
    </Tooltip>
  );
};

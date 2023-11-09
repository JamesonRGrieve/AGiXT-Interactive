import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Mic as MicIcon, Cancel as CancelIcon, Send as SendIcon, } from "@mui/icons-material";
export default function AudioRecorder(_a) {
    var conversationName = _a.conversationName, contextResults = _a.contextResults, conversationResults = _a.conversationResults, setIsLoading = _a.setIsLoading, agentName = _a.agentName, sdk = _a.sdk;
    var _b = useState(false), recording = _b[0], setRecording = _b[1];
    var _c = useState(null), audioData = _c[0], setAudioData = _c[1];
    var mediaRecorder = useRef(null);
    var startRecording = function () {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
            mediaRecorder.current = new MediaRecorder(stream, {
                mimeType: "audio/mp4",
            });
            mediaRecorder.current.ondataavailable = function (event) {
                setAudioData(event.data);
            };
            mediaRecorder.current.start();
            setRecording(true);
            setIsLoading(true);
        });
    };
    var sendAudio = function () {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setRecording(false);
        }
        if (audioData) {
            var reader_1 = new FileReader();
            reader_1.readAsArrayBuffer(audioData); // Use ArrayBuffer for raw binary data
            reader_1.onloadend = function () {
                var audioDataArray = new Uint8Array(reader_1.result);
                var base64Audio = btoa(String.fromCharCode.apply(null, audioDataArray)); // Convert to base64
                var response = sdk.executeCommand(agentName, "Chat with Voice", {
                    base64_audio: base64Audio,
                    conversation_results: conversationResults,
                    context_results: contextResults,
                }, conversationName);
                setAudioData(null);
            };
        }
    };
    var cancelRecording = function () {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setRecording(false);
            setIsLoading(false);
            setAudioData(null);
        }
    };
    return (_jsx("div", { children: !recording ? (_jsx(Tooltip, { title: "Record Audio", children: _jsx(IconButton, { color: "info", onClick: startRecording, children: _jsx(MicIcon, {}) }) })) : (_jsxs(_Fragment, { children: [_jsx(Tooltip, { title: "Cancel Recording", children: _jsx(IconButton, { color: "error", onClick: cancelRecording, children: _jsx(CancelIcon, {}) }) }), _jsx(Tooltip, { title: "Send Audio", children: _jsx(IconButton, { color: "info", onClick: sendAudio, children: _jsx(SendIcon, {}) }) })] })) }));
}

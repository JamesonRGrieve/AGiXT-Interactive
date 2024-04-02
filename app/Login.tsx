'use client';
import { setCookie } from 'cookies-next';
import React, { useState } from 'react';
export default function Login() {
  const [apiKey, setApiKey] = useState('');
  return (
    <div>
      <h1>AGiXT Chat</h1>
      <p>Please enter your API key to continue. You can find your API key in the AGiXT portal.</p>
      <input type='text' value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      <button
        onClick={() => {
          setCookie('apiKey', apiKey);
          setCookie('jwt', apiKey);
          location.reload();
        }}
      >
        Set API Key
      </button>
    </div>
  );
}

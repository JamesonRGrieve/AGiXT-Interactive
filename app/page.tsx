import React from 'react';
import InteractiveAGiXT from '../components/InteractiveAGiXT';
import { cookies } from 'next/headers';
import EnterAPIKey from './EnterAPIKey';
export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_AGIXT_API_KEY ?? cookies().get('jwt')?.value ?? '';
  if (process.env.MODE === 'development') {
    console.log('Server-Side API Key: ', apiKey);
  }
  return apiKey ? <InteractiveAGiXT /> : <EnterAPIKey />;
}

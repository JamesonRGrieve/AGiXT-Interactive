import React from 'react';
import { cookies } from 'next/headers';
import InteractiveAGiXT from '../components/InteractiveAGiXT';
import EnterAPIKey from './EnterAPIKey';
export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_AGIXT_API_KEY || cookies().get('jwt')?.value || '';
  if (process.env.NODE_ENV === 'development') {
    console.log('Server-Side API Key: ', apiKey);
  }
  return apiKey ? <InteractiveAGiXT /> : <EnterAPIKey />;
}

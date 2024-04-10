import React from 'react';
import AGiXTChat from '../components/InteractiveAGiXT';
import { cookies } from 'next/headers';
import EnterKey from './EnterKey';
export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_AGIXT_API_KEY ?? cookies().get('jwt')?.value ?? '';
  if (process.env.MODE === 'development') {
    console.log('Server-Side API Key: ', apiKey);
  }
  return apiKey ? <AGiXTChat /> : <EnterKey />;
}

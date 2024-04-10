import React from 'react';
import AGiXTChat from '../components/InteractiveAGiXT';
import { cookies } from 'next/headers';
import Login from './Login';
export default function Home() {
  const cookieStore = cookies();
  const apiKey = process.env.NEXT_PUBLIC_AGIXT_API_KEY ?? cookieStore.get('jwt')?.value ?? '';
  if (process.env.MODE === 'development') {
    console.log('Server-Side API Key: ', apiKey);
  }
  return apiKey ? <AGiXTChat /> : <Login />;
}

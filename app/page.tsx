import React from 'react';
import { cookies } from 'next/headers';
export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_AGIXT_API_KEY || cookies().get('jwt')?.value || '';
  if (process.env.NEXT_PUBLIC_ENV === 'development') {
    console.log('Server-Side API Key: ', apiKey);
  }
  <h1>Welcome to The Boilerplate!</h1>;
}

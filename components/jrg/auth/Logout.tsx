'use client';

import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react';
import { useAuthentication } from './Router';

export type LogoutProps = { redirectTo?: string };

export default function Logout({ redirectTo = '/' }: LogoutProps): ReactNode {
  const router = useRouter();
  const authConfig = useAuthentication();

  useEffect(() => {
    deleteCookie('jwt', { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN });
    router.refresh();
    router.replace(redirectTo);
    router.refresh();
  }, [router, redirectTo]);

  // Moved the conditional rendering here, after all hooks are called
  if (!authConfig.logout.heading) {
    return null;
  }

  return <h1 className='text-3xl'>{authConfig.logout.heading}</h1>;
}

'use client';

import React, { useEffect } from 'react';
import { useAuthentication } from '../Router';

export type CloseProps = {};

export default function Close() {
  const authConfig = useAuthentication();

  useEffect(() => {
    window.close();
  }, []);

  return authConfig.close.heading ? <h2 className='text-3xl'>{authConfig.close.heading}</h2> : null;
}

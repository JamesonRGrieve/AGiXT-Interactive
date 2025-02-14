'use client';

import { setCookie } from 'cookies-next';
import { useEffect } from 'react';

export default function ThemeSetter() {
  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      setCookie('theme', e.matches ? 'dark' : 'light');
    });
  }, []);

  return <></>;
}

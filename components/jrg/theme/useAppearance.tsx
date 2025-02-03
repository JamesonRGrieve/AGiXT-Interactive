'use client';

import { useState, useEffect } from 'react';
import { setCookie, getCookie } from 'cookies-next';

const defaultThemes = ['icons', 'labels'];

export const useAppearance = (customAppearances?: string[], initialAppearance?: string) => {
  const [appearances] = useState(() => {
    return Array.from(new Set([...defaultThemes, ...(customAppearances ?? [])]));
  });

  const [currentAppearance, setCurrentAppearance] = useState(() => {
    const cookieValue = getCookie('appearance');
    return cookieValue?.toString() ?? initialAppearance ?? 'labels';
  });

  const setAppearance = (newAppearance: string) => {
    document.body.classList.remove(...appearances);
    document.body.classList.add(newAppearance);

    setCookie('appearance', newAppearance, {
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    });
    setCurrentAppearance(newAppearance);
  };

  return {
    appearances,
    currentAppearance,
    setAppearance,
  };
};

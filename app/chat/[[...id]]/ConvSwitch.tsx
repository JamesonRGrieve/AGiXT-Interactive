'use client';

import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import { use, useEffect } from 'react';

export default function ConvSwitch({ id }: { id: string }) {
  const state = useInteractiveConfig();
  const chatId = id === 'new' ? '-' : id;
  useEffect(() => {
    state?.mutate((oldState) => ({
      ...oldState,
      overrides: { ...oldState.overrides, conversation: chatId },
    }));
  }, [id]);
  return null;
}

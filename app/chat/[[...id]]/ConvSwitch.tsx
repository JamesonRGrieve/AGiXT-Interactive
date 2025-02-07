'use client';

import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import { use, useEffect } from 'react';

export default function ConvSwitch({ id }: { id: string }) {
  const state = useInteractiveConfig();
  useEffect(() => {
    state?.mutate((oldState) => ({
      ...oldState,
      overrides: { ...oldState.overrides, conversation: id || '-' },
    }));
  }, [id]);
  return null;
}

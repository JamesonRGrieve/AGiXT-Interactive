'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export function RenderOnPath({ path, children }: { path: string; children: ReactNode }) {
  const pathname = usePathname();
  return pathname === path ? children : null;
}

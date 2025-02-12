// components/context/sidebar-context.tsx
'use client';

import React, { createContext, useContext, ReactNode } from 'react';

type SidebarContentType = {
  content: ReactNode | null;
  setContent: (content: ReactNode) => void;
};

const SidebarContentManager = createContext<SidebarContentType | undefined>(undefined);

export function SidebarContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = React.useState<ReactNode | null>(null);

  return <SidebarContentManager.Provider value={{ content, setContent }}>{children}</SidebarContentManager.Provider>;
}

export function useSidebarContent() {
  const context = useContext(SidebarContentManager);
  if (context === undefined) {
    throw new Error('useSidebarContent must be used within a SidebarContentProvider');
  }
  return context;
}

// Component to set sidebar content
export function SidebarContent({ children }: { children: ReactNode }) {
  const { setContent } = useSidebarContent();

  React.useEffect(() => {
    setContent(children);
    return () => setContent(null);
  }, [children, setContent]);

  return null;
}

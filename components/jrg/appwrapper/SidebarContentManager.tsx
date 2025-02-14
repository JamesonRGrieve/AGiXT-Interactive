'use client';

import React, { createContext, ReactNode, useContext } from 'react';

type SidebarContentType = {
  content: ReactNode | null;
  title: string | null;
  setContent: (content: ReactNode) => void;
  setTitle: (title: string) => void;
};

const SidebarContentManager = createContext<SidebarContentType | undefined>(undefined);

export function SidebarContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = React.useState<ReactNode | null>(null);
  const [title, setTitle] = React.useState<string | null>('Context Sidebar'); // Default title

  return (
    <SidebarContentManager.Provider value={{ content, title, setContent, setTitle }}>
      {children}
    </SidebarContentManager.Provider>
  );
}

export function useSidebarContent() {
  const context = useContext(SidebarContentManager);
  if (context === undefined) {
    throw new Error('useSidebarContent must be used within a SidebarContentProvider');
  }
  return context;
}

interface SidebarContentProps {
  children: ReactNode;
  title?: string;
}

// Component to set sidebar content
export function SidebarContent({ children, title = 'Context Sidebar' }: SidebarContentProps) {
  const { setContent, setTitle } = useSidebarContent();

  React.useEffect(() => {
    setContent(children);
    setTitle(title);
    return () => {
      setContent(null);
      setTitle('Context Sidebar');
    };
  }, [children, title, setContent, setTitle]);

  return null;
}

// Hook for consuming title in other components
export function useSidebarTitle() {
  const context = useContext(SidebarContentManager);
  if (!context) {
    throw new Error('useSidebarTitle must be used within a SidebarContentProvider');
  }
  return context.title;
}

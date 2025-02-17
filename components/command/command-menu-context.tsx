'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type CommandMenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  subPage: SubPage | null;
  setSubPage: (subPage: SubPage | null) => void;
  currentSubPage: SubPage | null;
};

const CommandMenuContext = createContext<CommandMenuContextType | undefined>(undefined);

type CommandMenuProviderProps = {
  children: ReactNode;
};

type SubPage = 'chat-history' | 'navigation' | 'wallet';

export function CommandMenuProvider({ children }: CommandMenuProviderProps) {
  const [open, setOpen] = useState(false);
  const [subPage, setSubPage] = useState<SubPage | null>(null);
  const currentSubPage = subPage;

  const toggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandMenuContext.Provider
      value={{
        open,
        setOpen,
        toggle,
        subPage,
        setSubPage,
        currentSubPage,
      }}
    >
      {children}
    </CommandMenuContext.Provider>
  );
}

export function useCommandMenu() {
  const context = useContext(CommandMenuContext);

  if (context === undefined) {
    throw new Error('useCommandMenu must be used within a CommandMenuProvider');
  }

  return context;
}

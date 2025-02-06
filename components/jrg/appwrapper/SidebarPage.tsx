import { ReactNode } from 'react';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from './SidebarHeader';

interface SidebarPageProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function SidebarPage({ title, children, className }: SidebarPageProps) {
  return (
    <>
      <SidebarHeader>
        <SidebarHeaderTitle>{title}</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain className={className}>{children}</SidebarMain>
    </>
  );
}

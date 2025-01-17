'use client';

import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { usePathname } from 'next/navigation';
import { ViewVerticalIcon } from '@radix-ui/react-icons';

import { AgentSwitcher } from './agent-switcher';
import { ChatHistory } from './chat-history';
import { NavMain } from '@/components/layout/nav-main';
import { NavUser } from '@/components/layout/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [hasStarted, setHasStarted] = useState(false);
  const { toggleSidebar } = useSidebar('left');
  const pathname = usePathname();
  if (pathname === '/' || (pathname.startsWith('/user') && pathname !== '/user/manage')) return null;

  useEffect(() => {
    if (getCookie('agixt-has-started') === 'true') {
      setHasStarted(true);
    }
  }, [getCookie('agixt-has-started')]);

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <AgentSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        {pathname.includes('/chat') && <ChatHistory />}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton tooltip='Hide Sidebar' side='left' onClick={toggleSidebar}>
          <ViewVerticalIcon />
          <span className='sr-only'>Toggle Sidebar</span>
        </SidebarMenuButton>
        <NavUser />
      </SidebarFooter>
      <SidebarRail side='left' />
    </Sidebar>
  );
}

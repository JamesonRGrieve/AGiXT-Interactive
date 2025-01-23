'use client';

import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { usePathname } from 'next/navigation';
import { ViewVerticalIcon } from '@radix-ui/react-icons';

import { AgentSelector } from '../../interactive/Selectors/agent-selector';
import { ChatHistory } from '../../interactive/Layout/chat-history';
import { NavMain } from '@/components/jrg/appwrapper/NavMain';
import { NavUser } from '@/components/jrg/appwrapper/NavUser';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';

export function SidebarMain({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [hasStarted, setHasStarted] = useState(false);
  const { toggleSidebar } = useSidebar('left');
  const pathname = usePathname();

  useEffect(() => {
    if (getCookie('agixt-has-started') === 'true') {
      setHasStarted(true);
    }
  }, [getCookie('agixt-has-started')]);

  if (pathname === '/' || (pathname.startsWith('/user') && pathname !== '/user/manage')) return null;

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <AgentSelector />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <ChatHistory />
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

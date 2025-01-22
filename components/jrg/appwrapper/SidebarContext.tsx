'use client';

import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { usePathname } from 'next/navigation';
import { ViewVerticalIcon } from '@radix-ui/react-icons';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';

export function SidebarContext({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [hasStarted, setHasStarted] = useState(false);
  const { toggleSidebar } = useSidebar('right');
  const pathname = usePathname();
  if (pathname === '/' || (pathname.startsWith('/user') && pathname !== '/user/manage')) return null;

  useEffect(() => {
    if (getCookie('agixt-has-started') === 'true') {
      setHasStarted(true);
    }
  }, [getCookie('agixt-has-started')]);

  return (
    <Sidebar collapsible='icon' side='right' {...props}>
      <SidebarHeader>
        <h3>Context Sidebar</h3>
      </SidebarHeader>
      <SidebarContent />
      <SidebarFooter>
        <SidebarMenuButton tooltip='Hide Sidebar' side='right' onClick={toggleSidebar}>
          <ViewVerticalIcon />
          <span className='sr-only'>Toggle Sidebar</span>
        </SidebarMenuButton>
      </SidebarFooter>
      <SidebarRail side='right' />
    </Sidebar>
  );
}

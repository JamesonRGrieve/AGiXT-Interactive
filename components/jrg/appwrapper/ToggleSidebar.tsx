'use client';

import { ViewVerticalIcon } from '@radix-ui/react-icons';
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';

export function ToggleSidebar({ side }: { side: 'left' | 'right' }) {
  const { toggleSidebar } = useSidebar(side);

  return (
    <SidebarMenuButton onClick={toggleSidebar}>
      <ViewVerticalIcon className='w-7 h-7' />
      <span>Toggle Sidebar</span>
    </SidebarMenuButton>
  );
}

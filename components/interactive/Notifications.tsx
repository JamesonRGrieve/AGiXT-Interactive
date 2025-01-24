'use client';

import { Bell } from 'lucide-react';
import { SidebarMenuButton } from '@/components/ui/sidebar';

export function Notifications() {
  return (
    <SidebarMenuButton>
      <Bell className='w-7 h-7' />
      <span>Notifications</span>
    </SidebarMenuButton>
  );
}

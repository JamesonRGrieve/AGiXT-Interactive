'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarHeader, SidebarInset } from '@/components/ui/sidebar';
import { PiBellSimpleRingingFill, PiBell } from 'react-icons/pi';

import { SidebarMenuButton } from '@/components/ui/sidebar';
import { SidebarMain, SidebarHeaderTitle } from '@/components/jrg/appwrapper/SidebarHeader';

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarInset>
      <SidebarHeader>
        <SidebarHeaderTitle>Notifications</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain>{children}</SidebarMain>
    </SidebarInset>
  );
}

export function Notifications() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const Icon = count > 0 ? PiBellSimpleRingingFill : PiBell;

  const handleClick = () => {
    router.push('/notifications');
  };

  return (
    <SidebarMenuButton onClick={handleClick}>
      <span>
        <Icon className='w-5 h-5' />
      </span>
      <span>
        Notifications
        {count > 0 && ` ( ${count} )`}
      </span>
    </SidebarMenuButton>
  );
}

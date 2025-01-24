'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarHeader, SidebarInset } from '@/components/ui/sidebar';
import { PiBellSimpleRingingFill, PiBell } from 'react-icons/pi';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { SidebarMain, SidebarHeaderTitle } from '@/components/jrg/appwrapper/SidebarHeader';
import { Card, CardContent } from '@/components/ui/card';
import { formatTimeAgo } from '@/lib/time-ago';
import { TooltipBasic } from '@/components/ui/tooltip';

const dummyNotifications = [
  {
    conversationId: '1',
    conversationName: 'Project Discussion',
    messageId: 'm1',
    message: 'Alice mentioned you in the discussion',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    role: 'mention',
  },
  {
    conversationId: '2',
    conversationName: 'Team Updates',
    messageId: 'm2',
    message: 'Bob shared a new document',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    role: 'share',
  },
  {
    conversationId: '3',
    conversationName: 'Bug Reports',
    messageId: 'm3',
    message: 'Critical issue needs attention',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    role: 'alert',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  return (
    <SidebarInset>
      <SidebarHeader>
        <SidebarHeaderTitle>Notifications</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain>
        {notifications.length > 0 ? <Notifications notifications={notifications} /> : <EmptyNotifications />}
      </SidebarMain>
    </SidebarInset>
  );
}

function Notifications({ notifications }: { notifications: typeof dummyNotifications }) {
  return (
    <div className='p-4 space-y-2'>
      {notifications.map((notification) => (
        <Card key={notification.messageId}>
          <CardContent className='p-4'>
            <div className='space-y-2'>
              <div className='flex items-start justify-between'>
                <h3 className='font-semibold'>{notification.conversationName}</h3>
                <TooltipBasic title={formatDate(notification.timestamp)}>
                  <span className='text-sm cursor-default text-muted-foreground'>
                    {formatTimeAgo(notification.timestamp)}
                  </span>
                </TooltipBasic>
              </div>
              <p className='text-sm text-muted-foreground'>{notification.message}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyNotifications() {
  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <h2 className='mb-4 text-2xl'>No notifications</h2>
      <p className='text-muted-foreground'>You have no notifications to display</p>
    </div>
  );
}

export function NotificationsNavItem() {
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

function formatDate(timestamp: string) {
  return new Date(timestamp).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

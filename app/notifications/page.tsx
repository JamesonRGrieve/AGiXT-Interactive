'use client';

import { useState } from 'react';
import { SidebarHeader, SidebarInset } from '@/components/ui/sidebar';
import { SidebarMain, SidebarHeaderTitle } from '@/components/jrg/appwrapper/SidebarHeader';
import { EmptyNotifications, Notifications } from '@/components/interactive/Notifications';

export const dummyNotifications = [
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
  const [notifications, setNotifications] = useState([]);
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

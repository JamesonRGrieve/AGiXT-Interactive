'use client';

import { useState } from 'react';
import { EmptyNotifications, Notifications } from '@/components/interactive/Notifications';
import { SidebarPage } from '@/components/jrg/appwrapper/SidebarPage';

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
    <SidebarPage title='Notifications'>
      {notifications.length > 0 ? <Notifications notifications={notifications} /> : <EmptyNotifications />}
    </SidebarPage>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PiBellSimpleRingingFill, PiBell } from 'react-icons/pi';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatTimeAgo } from '@/lib/time-ago';
import { dummyNotifications } from '@/app/notifications/page';

export function NotificationsNavItem() {
  const router = useRouter();
  const [count, setCount] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const Icon = count > 0 ? PiBellSimpleRingingFill : PiBell;

  const handleViewAll = () => {
    setIsOpen(false);
    router.push('/notifications');
  };

  const handleNotificationClick = (conversationId: string) => {
    setCount((prev) => Math.max(0, prev - 1));
    setIsOpen(false);
    router.push(`/chat/${conversationId}`);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton>
          <span className='relative'>
            <Icon className='w-5 h-5' />
            {count > 0 && (
              <span className='absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -right-1'>
                {count}
              </span>
            )}
          </span>
          <span>Notifications</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {dummyNotifications.map((notification) => (
            <DropdownMenuItem
              key={notification.messageId}
              onClick={() => handleNotificationClick(notification.conversationId)}
              className='flex flex-col items-start gap-1 py-2'
            >
              <div className='font-medium'>{notification.conversationName}</div>
              <div className='text-sm text-muted-foreground'>{notification.message}</div>
              <div className='text-xs text-muted-foreground'>{formatTimeAgo(notification.timestamp)}</div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleViewAll}>View all notifications</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

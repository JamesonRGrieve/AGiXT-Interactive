'use client';

import { BadgeCheck, Bell, LogOut } from 'lucide-react';
import { CaretRightIcon, ComponentPlaceholderIcon } from '@radix-ui/react-icons';

import { useRouter } from 'next/navigation';
import { Skeleton } from '../../ui/skeleton';
import { Button } from '../../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Appearances, Themes } from '@/components/jrg/appwrapper/UserMenu';
import useUser from '@/components/jrg/auth/hooks/useUser';
import { getGravatarUrl } from '@/components/jrg/auth/gravatar';

const user = {
  name: 'shadcn',
  email: 'm@example.com',
  avatar: '/avatars/shadcn.jpg',
};

export function NavUser() {
  const { isMobile } = useSidebar('left');
  const router = useRouter();
  const { data: user } = useUser();

  const handleLogout = () => {
    router.push('/user/logout');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              side='left'
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:my-2 pl-0 transition-none'
            >
              <Avatar className='w-8 h-8 rounded-lg'>
                <AvatarImage src={getGravatarUrl(user?.email)} alt={user?.firstName} />
                <AvatarFallback className='rounded-lg'>{userInitials(user)}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-sm leading-tight text-left'>
                {!user.email ? (
                  <>
                    <Skeleton className='w-1/2 h-3 mb-1' />
                    <Skeleton className='h-3' />
                  </>
                ) : (
                  <>
                    <span className='font-semibold capitalize truncate'>
                      {user.firstName} {user.lastName}
                    </span>
                    <span className='text-xs truncate'>{user.email}</span>
                  </>
                )}
              </div>

              <CaretRightIcon className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-2 text-sm text-left'>
                <Avatar className='w-8 h-8 rounded-lg'>
                  <AvatarImage src={getGravatarUrl(user?.email)} alt={user?.name} />
                  <AvatarFallback className='rounded-lg'>{userInitials(user)}</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-sm leading-tight text-left'>
                  <span className='font-semibold truncate'>
                    {user.firstName} {user.lastName}
                  </span>
                  <span className='text-xs truncate'>{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/user/manage')}>
                <BadgeCheck className='mr-2 size-4' />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ComponentPlaceholderIcon className='mr-2 size-4' />
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <Themes />
            <Appearances />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className='mr-2 size-4' />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function userInitials({ firstName, lastName }: { firstName: string; lastName: string }): string | null {
  if (!firstName || !lastName) return null;
  return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
}

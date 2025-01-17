'use client';

import { BadgeCheck, Bell, BuildingIcon, LogOut, Sparkles } from 'lucide-react';
import { CaretSortIcon, ComponentPlaceholderIcon } from '@radix-ui/react-icons';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Appearance } from '@/components/jrg/wrapper/new/UserMenu';
import useUser from '@/components/jrg/auth/hooks/useUser';
import { useRouter } from 'next/navigation';
import { getGravatarUrl } from '@/lib/gravatar';
import { Skeleton } from '../ui/skeleton';
import { useActiveCompany, useCompanies } from '../interactive/hooks';
import { getCookie, setCookie } from 'cookies-next';
import { cn } from '@/lib/utils';

const user = {
  name: 'shadcn',
  email: 'm@example.com',
  avatar: '/avatars/shadcn.jpg',
};

export function NavCompany() {
  const { isMobile } = useSidebar('left');
  const router = useRouter();

  const { data: company } = useActiveCompany();
  console.log(company);
  const { data: companies } = useCompanies();
  const { data: user, mutate: mutateUser } = useUser();
  const { data, mutate: mutateActiveCompany } = useActiveCompany();
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
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='w-8 h-8 rounded-lg'>
                <AvatarImage src={getGravatarUrl(user?.email)} alt={user?.first_name} />
                <AvatarFallback className='rounded-lg'>{userInitials(company ? company?.name : 'Company')}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-sm leading-tight text-left'>
                <span className='font-semibold capitalize truncate'>{company ? company.name : 'Company'}</span>
              </div>
              <CaretSortIcon className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side='top'
            align='center'
          >
            <DropdownMenuLabel>Switch Company</DropdownMenuLabel>
            {companies.map((company) => (
              <DropdownMenuItem
                key={company.id}
                className={cn('capitalize', company.id == getCookie('agixt-company-id') && 'bg-muted')}
                onClick={() => {
                  setCookie('agixt-company-id', company.id, {
                    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
                  });
                  mutateUser();
                  mutateActiveCompany();
                }}
              >
                {company.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function userInitials(name: string): string {
  return (
    name && `${name.split(' ')[0][0].toUpperCase()}${name.split(' ').length > 1 && name.split(' ')[1][0].toUpperCase()}`
  );
}

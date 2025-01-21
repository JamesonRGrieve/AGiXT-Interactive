'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { MoonIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/jrg/theme/useTheme';
import useUser from '@/auth/hooks/useUser';
import { getGravatarUrl } from '@/lib/gravatar';
import { useCompany } from '@/components/interactive/hooks';

type MenuItem = {
  name: string;
  href: string;
};

type UserMenuGroups = MenuItem[][];

export const UserMenu = ({ userMenuItems }: { userMenuItems: UserMenuGroups }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: user, mutate: mutateUser } = useUser();
  const { mutate: mutateActiveCompany } = useCompany();
  const handleRouting = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  const handleLogout = () => {
    router.push('/user/logout');
  };

  return (
    <div className='flex items-center gap-4 md:gap-2 lg:gap-4'>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button size='icon' variant='outline' className='bg-transparent rounded-full border-foreground/50'>
            <Avatar>
              <AvatarImage src={getGravatarUrl(user?.email)} alt={user?.name} />
              <AvatarFallback className='bg-transparent'>
                <span className='sr-only'>Toggle user menu</span>
                {userInitials(user) ? (
                  <span className='text-lg'>{userInitials(user)}</span>
                ) : (
                  <CircleUser className='w-10 h-10' />
                )}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>{process.env.NEXT_PUBLIC_APP_NAME}</DropdownMenuLabel>
          {userMenuItems.map((items, index) => (
            <>
              <DropdownMenuSeparator key={index + '-sep'} />
              <DropdownMenuGroup key={index}>
                {items.map((item) => (
                  <DropdownMenuItem key={item.name} onClick={() => handleRouting(item.href)}>
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </>
          ))}
          <Company />
          <DropdownMenuSeparator />
          <Appearance />
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const Appearance = () => {
  const { themes, currentTheme, setTheme } = useTheme();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <MoonIcon className='w-4 h-4 mr-2' />
        Appearance
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          {themes.map((theme) => (
            <DropdownMenuItem
              key={theme}
              className={cn('capitalize', theme === currentTheme && 'bg-muted')}
              onClick={() => setTheme(theme)}
            >
              {theme}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};

function userInitials({ first_name, last_name }: { first_name: string; last_name: string }): string | null {
  if (!first_name || !last_name) return null;
  return `${first_name[0].toUpperCase()}${last_name[0].toUpperCase()}`;
}

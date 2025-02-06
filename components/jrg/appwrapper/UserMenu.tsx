'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { LayoutGrid, MoonIcon } from 'lucide-react';
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
import { getGravatarUrl } from '@/components/jrg/auth/gravatar';
import { useCompany } from '@/components/interactive/hooks';
import { useAppearance } from '../theme/useAppearance';

type MenuItem = {
  name: string;
  href: string;
};

type UserMenuGroups = MenuItem[][];

export const Themes = () => {
  const { themes, currentTheme, setTheme } = useTheme();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <MoonIcon className='w-4 h-4 mr-2' />
        Themes
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuLabel>Themes</DropdownMenuLabel>
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
export const Appearances = () => {
  const { appearances, appearance, setAppearance } = useAppearance();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <LayoutGrid className='w-4 h-4 mr-2' />
        Appearances
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuLabel>Appearances</DropdownMenuLabel>
          {appearances.map((thisAppearance) => (
            <DropdownMenuItem
              key={thisAppearance}
              className={cn('capitalize', thisAppearance === appearance && 'bg-muted')}
              onClick={() => setAppearance(thisAppearance)}
            >
              {thisAppearance}
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

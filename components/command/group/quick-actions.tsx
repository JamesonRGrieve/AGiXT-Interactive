import { TbMessageCirclePlus } from 'react-icons/tb';
import { User, Puzzle, HelpCircle, Wallet } from 'lucide-react';
import { useCallback } from 'react';
import { CommandItemComponent } from '../index';
import { SubPage, useCommandMenu } from '../command-menu-context';
import { CommandGroup, CommandSeparator } from '@/components/ui/command';

export function QuickActionsGroup() {
  const { openSubPage, currentSubPage } = useCommandMenu();

  const onSelect = useCallback(
    (item: { subPage?: string }) => {
      if (item.subPage) {
        openSubPage(item.subPage as SubPage);
      }
    },
    [openSubPage],
  );

  if (currentSubPage !== null) return null;

  return (
    <>
      <CommandGroup heading='Quick Actions'>
        {quickActions.map((item) => (
          <CommandItemComponent key={item.label} item={item} onSelect={() => onSelect(item)} />
        ))}
      </CommandGroup>
      <CommandSeparator />
    </>
  );
}

export const quickActions = [
  {
    label: 'Chat History',
    icon: TbMessageCirclePlus,
    shortcut: ['⌘', 'N'],
    subPage: 'chat-history',
  },
  {
    label: 'Wallet',
    icon: Wallet,
    shortcut: ['⌘', 'W'],
    subPage: 'wallet-list',
  },
  {
    label: 'Extensions',
    icon: Puzzle,
    shortcut: ['⌘', 'E'],
    subPage: 'extensions',
  },
  {
    label: 'Profile',
    icon: User,
    shortcut: ['⌘', 'P'],
    subPage: 'profile',
  },
  {
    label: 'Settings',
    icon: HelpCircle,
    shortcut: ['⌘', 'S'],
    subPage: 'settings',
  },
];

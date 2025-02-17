import { TbMessageCirclePlus } from 'react-icons/tb';
import { User, Puzzle, Rocket, HelpCircle, Wallet } from 'lucide-react';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CommandItemComponent } from '../index';
import { useCommandMenu } from '../command-menu-context';
import { CommandGroup, CommandSeparator } from '@/components/ui/command';

export function QuickActionsGroup() {
  const router = useRouter();
  const { setOpen, setSubPage } = useCommandMenu();

  const onSelect = useCallback(
    (item: { subPage?: string }) => {
      if (item.subPage) {
        setSubPage(item.subPage as any);
      }
    },
    [setSubPage],
  );

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
    label: 'Chat',
    icon: TbMessageCirclePlus,
    shortcut: ['⌘', 'N'],
    subPage: 'chat-history',
  },
  {
    label: 'Wallet',
    icon: Wallet,
    shortcut: ['⌘', 'W'],
    subPage: 'wallet',
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

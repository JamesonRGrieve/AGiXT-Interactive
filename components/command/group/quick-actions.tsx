import { TbMessageCirclePlus } from 'react-icons/tb';
import { User, Puzzle, Rocket, HelpCircle } from 'lucide-react';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CommandItemComponent, CommandMenuGroup } from '../index';
import { useCommandMenu } from '../command-menu-context';
import { CommandGroup, CommandSeparator } from '@/components/ui/command';

export function QuickActionsGroup() {
  const router = useRouter();
  const { setOpen } = useCommandMenu();

  const onSelect = useCallback(
    (item: { url?: string }) => {
      if (item.url) {
        router.push(item.url);
        setOpen(false);
      }
    },
    [router, setOpen],
  );

  return (
    <>
      <CommandGroup heading={quickActions.heading}>
        {quickActions.items.map((item) => (
          <CommandItemComponent key={item.label} item={item} onSelect={() => onSelect(item)} />
        ))}
      </CommandGroup>
      <CommandSeparator />
    </>
  );
}

export const quickActions: CommandMenuGroup = {
  heading: 'Quick Actions',
  items: [
    {
      icon: TbMessageCirclePlus,
      label: 'New Chat',
      description: 'Start a new chat',
      url: '/chat',
      keywords: ['chat', 'new', 'start'],
    },
    {
      icon: User,
      label: 'Profile',
      description: 'Manage your profile',
      url: '/user/manage',
      keywords: ['profile', 'manage', 'user'],
    },
    {
      icon: Puzzle,
      label: 'Extensions',
      description: 'Manage agent extensions',
      url: '/settings/extensions',
      keywords: ['extensions', 'manage', 'agent'],
    },
    {
      icon: Rocket,
      label: 'Getting Started',
      description: 'View getting started guide',
      url: '/docs/getting-started',
      keywords: ['getting started', 'guide', 'documentation'],
    },
    {
      icon: HelpCircle,
      label: 'Support',
      description: 'Get help, report a bug, or request a feature',
      url: '/docs/support',
      keywords: ['support', 'help', 'bug', 'feature'],
    },
  ],
};

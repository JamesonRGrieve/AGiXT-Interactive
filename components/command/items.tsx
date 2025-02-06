import { User, MessageSquarePlus, Puzzle, Rocket, HelpCircle } from 'lucide-react';
import { items } from '@/components/jrg/appwrapper/NavMain';
import { TbMessageCirclePlus } from 'react-icons/tb';

export type CommandMenuItem = {
  icon: any;
  label: string;
  description: string;
  url?: string;
  disabled?: boolean;
};

export type CommandMenuGroup = {
  heading: string;
  items: CommandMenuItem[];
};

export const suggestions: CommandMenuGroup = {
  heading: 'Suggestions',
  items: [
    {
      icon: TbMessageCirclePlus,
      label: 'New Chat',
      description: 'Start a new chat',
      url: '/chat',
    },
    {
      icon: User,
      label: 'Profile',
      description: 'Manage your profile',
      url: '/user/manage',
    },
    {
      icon: Puzzle,
      label: 'Extensions',
      description: 'Manage agent extensions',
      url: '/settings/extensions',
    },
    {
      icon: Rocket,
      label: 'Getting Started',
      description: 'View getting started guide',
      url: '/docs/getting-started',
    },
    {
      icon: HelpCircle,
      label: 'Support',
      description: 'Get help, report a bug, or request a feature',
      url: '/docs/support',
    },
  ],
};

export const pagesGroup: CommandMenuGroup = {
  heading: 'Pages',
  items: [
    // Add root level items that don't have children
    ...items
      .filter((item) => item.url && !item.items)
      .map((item) => ({
        icon: item.icon,
        label: item.title,
        description: item.title,
        url: item.url,
      })),
    // Add nested items
    ...items
      .filter((item) => item.items)
      .flatMap((group) =>
        (group.items ?? []).map((item) => ({
          icon: item.icon,
          label: item.title,
          description: item.title,
          url: item.url,
        })),
      ),
  ],
};

export const commandMenuItems: CommandMenuGroup[] = [suggestions, pagesGroup];

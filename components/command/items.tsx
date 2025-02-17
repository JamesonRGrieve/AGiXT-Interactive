import { User, MessageSquarePlus, Puzzle, Rocket, HelpCircle } from 'lucide-react';
import { items } from '@/components/jrg/appwrapper/NavMain';
import { TbMessageCirclePlus } from 'react-icons/tb';

export type CommandMenuItem = {
  icon: any;
  label: string;
  description: string;
  url?: string;
  disabled?: boolean;
  keywords?: string[];
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
        keywords: ['page', 'navigate', item.title],
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
          keywords: ['page', 'navigate', item.title],
        })),
      ),
  ],
};

export const commandMenuItems: CommandMenuGroup[] = [suggestions, pagesGroup];

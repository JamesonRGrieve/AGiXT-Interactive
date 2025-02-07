'use client';

import { ChevronRightIcon } from '@radix-ui/react-icons';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TbMessageCirclePlus } from 'react-icons/tb';
import {
  BookOpen,
  SquareLibrary,
  HelpCircle,
  VenetianMask,
  Rocket,
  Link as LuLink,
  GraduationCap,
  Settings,
  Bot,
  Users,
  User,
  Puzzle,
  Building,
  Workflow,
} from 'lucide-react';

import Link from 'next/link';
import { useCompany } from '../../interactive/hooks';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type Item = {
  title: string;
  url?: string;
  visible?: boolean;
  icon?: any;
  isActive?: boolean;
  queryParams?: object;
  items?: {
    max_role?: number;
    title: string;
    icon?: any;
    url: string;
    queryParams?: object;
  }[];
};

export const items: Item[] = [
  {
    title: 'New Chat',
    url: '/chat',
    icon: TbMessageCirclePlus,
    isActive: true,
  },
  {
    title: 'Agent Management',
    icon: Bot,
    items: [
      {
        title: 'Prompt Library',
        icon: SquareLibrary,
        url: '/settings/prompts',
      },
      {
        title: 'Chain Library',
        icon: LuLink,
        url: '/settings/chains',
      },
      {
        title: 'Training',
        icon: GraduationCap,
        url: '/settings/training',
        queryParams: {
          mode: 'user',
        },
      },
      {
        title: 'Extensions',
        icon: Puzzle,
        url: '/settings/extensions',
        queryParams: {
          tab: 'extensions',
          mode: 'user',
        },
      },
      {
        title: 'Abilities',
        icon: Workflow,
        url: '/settings/extensions',
        queryParams: {
          tab: 'abilities',
          mode: 'user',
        },
      },
      {
        title: 'Settings',
        icon: Settings,
        url: '/settings', // Still need to split off provider settings and add agent rename functionality on a new page
      },
    ],
  },
  {
    title: 'Team Management',
    icon: Users,
    items: [
      {
        title: 'Team',
        icon: User,
        url: '/team',
      },
      {
        title: 'Team Training',
        icon: GraduationCap,
        url: '/settings/training',
        queryParams: {
          mode: 'company',
        },
      },
      {
        title: 'Team Extensions',
        icon: Puzzle,
        url: '/settings/extensions',
        queryParams: {
          tab: 'extensions',
          mode: 'company',
        },
      },
      {
        title: 'Team Abilities',
        icon: Workflow,
        url: '/settings/extensions',
        queryParams: {
          tab: 'abilities',
          mode: 'company',
        },
      },
      {
        title: 'Team Settings',
        icon: Settings,
        url: '/settings',
        queryParams: {
          mode: 'company',
        },
      },
    ],
  },
  {
    title: 'Documentation',
    icon: BookOpen,
    items: [
      {
        title: 'Getting Started',
        icon: Rocket,
        url: '/docs/getting-started',
      },
      {
        title: 'API Reference',
        icon: BookOpen,
        url: '/docs/api-reference',
      },
      {
        title: 'Support',
        icon: HelpCircle,
        url: '/docs/support',
      },
      {
        title: 'Privacy Policy',
        icon: VenetianMask,
        url: '/docs/privacy',
      },
    ],
  },
];

export function NavMain() {
  const router = useRouter();
  const pathname = usePathname();
  const queryParams = useSearchParams();
  const { data: company } = useCompany();
  const { toggleSidebar, open } = useSidebar('left');

  const itemsWithActiveState = items.map((item) => ({
    ...item,
    isActive: isActive(item, pathname, queryParams),
  }));

  // Add logic to determine if team management should be shown
  if (false) {
    itemsWithActiveState.find((item) => item.title === 'Team Management').visible = false;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarMenu>
        {itemsWithActiveState.map(
          (item) =>
            item.visible !== false && (
              <Collapsible key={item.title} asChild defaultOpen={item.isActive} className='group/collapsible'>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      side='left'
                      tooltip={item.title}
                      onClick={() => {
                        if (!open) toggleSidebar();
                        if (item.url) router.push(item.url);
                      }}
                      className={cn(item.isActive && !item.items?.length && 'bg-muted')}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRightIcon
                        className={cn(
                          'ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90',
                          item.items?.length ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent hidden={!item.items?.length}>
                    <SidebarMenuSub className='pr-0 mr-0'>
                      {item.items?.map((subItem) =>
                        subItem.max_role && (!company?.name || company?.my_role > subItem.max_role) ? null : (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={
                                  subItem.queryParams
                                    ? Object.entries(subItem.queryParams).reduce(
                                        (url, [key, value]) => url + `${key}=${value}&`,
                                        subItem.url + '?',
                                      )
                                    : subItem.url
                                }
                                className={cn('w-full', isSubItemActive(subItem, pathname, queryParams) && 'bg-muted')}
                              >
                                <span className='flex items-center gap-2'>
                                  {subItem.icon && <subItem.icon className='w-4 h-4' />}
                                  {subItem.max_role && company?.name + ' '}
                                  {subItem.title}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ),
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function isActive(item: Item, pathname: string, queryParams: URLSearchParams) {
  if (item.items) {
    return item.items.some((subItem) => {
      if (subItem.url === pathname) {
        if (subItem.queryParams) {
          return Object.entries(subItem.queryParams).every(([key, value]) => queryParams.get(key) === value);
        }
        // If no query params are defined on the item, require URL to have no query params
        return [...queryParams.keys()].length === 0;
      }
      return false;
    });
  }

  // Root level items
  if (item.url === pathname) {
    if (item.queryParams) {
      return Object.entries(item.queryParams).every(([key, value]) => queryParams.get(key) === value);
    }
    return [...queryParams.keys()].length === 0;
  }
  return false;
}
function isSubItemActive(subItem: Item['items'][0], pathname: string, queryParams: URLSearchParams) {
  if (subItem.url !== pathname) {
    return false;
  }

  // If subitem has query params, they must all match
  if (subItem.queryParams) {
    return Object.entries(subItem.queryParams).every(([key, value]) => queryParams.get(key) === value);
  }

  // If no query params defined on subitem, URL must have no query params
  return queryParams.size === 0;
}

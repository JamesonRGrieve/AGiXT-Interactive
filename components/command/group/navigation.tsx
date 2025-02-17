import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CommandItemComponent, CommandMenuGroup } from '../index';
import { useCommandMenu } from '../command-menu-context';
import { CommandGroup, CommandSeparator } from '@/components/ui/command';
import { items } from '@/components/jrg/appwrapper/NavMain';

export function NavigationGroup() {
  const router = useRouter();
  const { setOpen, currentSubPage } = useCommandMenu();

  const onSelect = useCallback(
    (item: { url?: string }) => {
      if (item.url) {
        router.push(item.url);
        setOpen(false);
      }
    },
    [router, setOpen],
  );

  if (currentSubPage !== 'navigation') return null;

  return (
    <>
      <CommandGroup heading={navigationGroup.heading}>
        {navigationGroup.items.map((item) => (
          <CommandItemComponent key={item.label} item={item} onSelect={() => onSelect(item)} />
        ))}
      </CommandGroup>
      <CommandSeparator />
    </>
  );
}

export const navigationGroup: CommandMenuGroup = {
  heading: 'Navigation',
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

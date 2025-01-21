'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavItem = {
  name: string;
  href: string;
};

type NavItemProps = {
  active?: string;
} & React.HTMLAttributes<HTMLAnchorElement>;

type NavProps = {
  navItems: NavItem[];
  itemProps?: NavItemProps;
} & React.HTMLAttributes<HTMLDivElement>;

export const Nav = ({ navItems, itemProps, className, ...props }: NavProps) => {
  const pathname = usePathname();
  const { className: itemClassName, active, ...itemRest } = itemProps || {};

  return (
    <nav className={cn('flex gap-6 md:gap-5 lg:gap-6 md:text-sm font-medium text-lg', className)} {...props}>
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            'transition-colors text-muted-foreground hover:text-foreground text-base',
            itemClassName,
            pathname === item.href && (active ?? 'text-foreground'),
          )}
          {...itemRest}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

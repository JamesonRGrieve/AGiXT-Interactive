import { ReactNode } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { Header } from 'jrgcomponents/Header';
import { MobileSideBar } from 'jrgcomponents/MobileSideBar';
import { Nav } from 'jrgcomponents/Nav';
import { UserMenu } from 'jrgcomponents/UserMenu';
import { Code } from 'lucide-react';
import { ThemeToggle } from 'jrgcomponents/Theming/ThemeToggle';

export default function HeaderLayout(): ReactNode {
  const cookieStore = cookies();
  const isLoggedIn = !!cookieStore.get('jwt')?.value;

  return (
    <Header>
      <MobileSideBar>
        <Logo />
        {isLoggedIn && <Nav navItems={navItems} className='flex-col' />}
      </MobileSideBar>
      <Logo />
      {isLoggedIn && <Nav navItems={navItems} className='hidden md:flex' />}
      {isLoggedIn ? <UserMenu userMenuItems={userMenuItems} /> : <ThemeToggle />}
    </Header>
  );
}

const Logo = () => {
  return (
    <div className='flex items-center'>
      <Link href='/' className='flex items-center gap-2 text-lg font-semibold md:text-base text-foreground'>
        <Code className='w-6 h-6' />
        <span className='sr-only'>XT Systems</span>
      </Link>
    </div>
  );
};

const navItems = [
  {
    name: 'Item 1',
    href: '/',
  },
  {
    name: 'Item 2',
    href: '/item-2',
  },
  {
    name: 'Item 3',
    href: '/item-3',
  },
  {
    name: 'Item 4',
    href: '/item-4',
  },
  {
    name: 'Item 5',
    href: '/item-5',
    integration: true,
  },
];

const userMenuItems = [
  [
    {
      name: 'Profile',
      href: '/profile',
    },
    {
      name: 'Settings',
      href: '/settings',
    },
    {
      name: 'Support',
      href: '/support',
    },
  ],
];

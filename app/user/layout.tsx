'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/layout/sidebar-header';
import { usePathname } from 'next/navigation';

export default function UserLayout({ children }: { children: ReactNode }): ReactNode {
  const pathname = usePathname();

  if (pathname === '/user/manage') return <ManageWrapper>{children}</ManageWrapper>;

  return (
    <SidebarInset className='flex flex-col w-full h-full'>
      <header
        className='sticky top-0 flex items-center justify-between gap-4 px-4 border-b md:px-6 bg-muted min-h-16'
        style={{ paddingTop: 'env(safe-area-inset-top', height: 'calc(3.5rem + env(safe-area-inset-top))' }}
      >
        <Logo />
      </header>
      <div className='flex flex-col items-center justify-center flex-1 w-full'>{children}</div>
    </SidebarInset>
  );
}

function ManageWrapper({ children }: { children: ReactNode }) {
  return (
    <SidebarInset>
      <SidebarHeader>
        <SidebarHeaderTitle>Account Management</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain>{children}</SidebarMain>
    </SidebarInset>
  );
}

export const Logo = () => {
  return (
    <div className='flex items-center'>
      <Link href='/' className='flex items-center gap-2 text-lg font-semibold md:text-lg text-foreground'>
        <span className=''>{process.env.NEXT_PUBLIC_APP_NAME}</span>
      </Link>
    </div>
  );
};

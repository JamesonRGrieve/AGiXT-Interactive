import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import Head from '@/components/jrg/appwrapper/old/Head';
import { cn } from '@/lib/utils';
import './globals.css';
import InteractiveConfigContextWrapper from '@/components/interactive/ContextWrapper';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SidebarMain } from '@/components/jrg/appwrapper/SidebarMain';
import { SidebarContext } from '@/components/jrg/appwrapper/SidebarContext';
import { Toaster } from '@/components/ui/toaster';
import { metadata, viewport } from './metadata';
import '@/components/jrg/zod2gql/zod2gql';
import { CommandMenu } from '@/components/command';
import { SidebarContentProvider } from '@/components/jrg/appwrapper/SidebarContentManager';

const inter = Inter({ subsets: ['latin'] });

export { metadata, viewport };

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  const cookieStore = cookies();
  const theme = cookieStore.get('theme')?.value ?? '';
  const appearance = cookieStore.get('appearance')?.value ?? '';

  return (
    <html lang='en'>
      <Head />
      <body className={cn(inter.className, theme, appearance)}>
        <InteractiveConfigContextWrapper>
          <SidebarContentProvider>
            <SidebarProvider className='flex-1'>
              <SidebarMain side='left' />
              {children}
              <Toaster />
              <CommandMenu />
              <SidebarContext side='right' />
            </SidebarProvider>
          </SidebarContentProvider>
        </InteractiveConfigContextWrapper>
      </body>
    </html>
  );
}

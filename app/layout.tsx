import type { Metadata } from 'next';
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
import '@/lib/zodGQL';
import { metadata, viewport } from './metadata';

const inter = Inter({ subsets: ['latin'] });

export { metadata, viewport };

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  const cookieStore = cookies();
  const theme = cookieStore.get('theme')?.value ?? '';

  return (
    <html lang='en'>
      <Head />
      <body className={cn(inter.className, theme)}>
        <InteractiveConfigContextWrapper>
          <SidebarProvider>
            <SidebarMain side='left' />
            {children}
            <Toaster />
            {/* <ContextSidebar side='right' /> */}
          </SidebarProvider>
        </InteractiveConfigContextWrapper>
      </body>
    </html>
  );
}

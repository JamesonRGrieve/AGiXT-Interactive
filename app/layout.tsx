import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import Head from '@/components/jrg/wrapper/Head';
import { cn } from '@/lib/utils';
import './globals.css';
import InteractiveConfigContextWrapper from '@/components/interactive/ContextWrapper';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { ContextSidebar } from '@/components/layout/context-sidebar';
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
            <AppSidebar side='left' />
            {children}
            <Toaster />
            {/* <ContextSidebar side='right' /> */}
          </SidebarProvider>
        </InteractiveConfigContextWrapper>
      </body>
    </html>
  );
}

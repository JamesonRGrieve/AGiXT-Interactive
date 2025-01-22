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
import '@/components/jrg/zod2gql/zod2gql';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  appleWebApp: {
    title: process.env.NEXT_PUBLIC_APP_NAME,
    statusBarStyle: 'black-translucent',
  },
};

export const viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  shrinkToFit: 'no',
  viewportFit: 'cover',
  userScalable: false,
};

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

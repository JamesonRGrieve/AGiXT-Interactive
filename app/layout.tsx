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
import { ServiceWorkerRegistration } from '@/components/service-worker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    title: process.env.NEXT_PUBLIC_APP_NAME,
    statusBarStyle: 'black-translucent',
    capable: true,
    startupImage: [
      {
        url: '/apple-splash-2048-2732.jpg',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/apple-splash-1668-2388.jpg',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/apple-splash-1290-2796.jpg',
        media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)',
      },
    ],
  },
  icons: {
    apple: [{ url: '/XTIcon_180.png', sizes: '180x180' }],
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000',
      },
    ],
  },
  applicationName: process.env.NEXT_PUBLIC_APP_NAME,
  themeColor: 'var(--primary)',
  other: {
    'mobile-web-app-capable': 'yes',
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
        <ServiceWorkerRegistration />
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

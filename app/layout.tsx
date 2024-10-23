import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import Head from 'jrgcomponents/Head';
import { AppWrapper } from 'jrgcomponents/Wrapper';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
};

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  const cookieStore = cookies();
  const theme = cookieStore.get('theme')?.value ?? '';

  return (
    <html lang='en'>
      <Head />
      <body className={cn(inter.className, theme)}>
        <AppWrapper>
          <Header />
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import ThemeWrapper from 'jrgcomponents/Theming/ThemeWrapper';
import theme from './theme';
import Head from 'jrgcomponents/Head';
import React, { ReactNode } from 'react';
const inter = Inter({ subsets: ['latin'] });
import './globals.css';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
};

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  const cookieStore = cookies();

  return (
    <html lang='en'>
      <Head />
      <body className={inter.className}>
        <ThemeWrapper
          themeInjection={{ theme: theme }}
          defaultTheme={{
            dark: cookieStore.get('dark')?.value
              ? cookieStore.get('dark')?.value === 'true'
              : process.env.NEXT_PUBLIC_DEFAULT_THEME_MODE === 'dark',
            colorblind: cookieStore.get('colorblind')?.value === 'true',
          }}
        >
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}

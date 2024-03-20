import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
// eslint-disable-next-line import/no-unassigned-import
import 'jrgcomponents/Style/Global';
import ThemeWrapper from 'jrgcomponents/Theming/ThemeWrapper';
import theme from './theme';
import Head from 'jrgcomponents/Head';
import React, { ReactNode } from 'react';
const inter = Inter({ subsets: ['latin'] });

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
          defaultDark={
            cookieStore.get('dark')?.value
              ? cookieStore.get('dark')?.value === 'true'
              : process.env.NEXT_PUBLIC_DEFAULT_THEME_MODE === 'dark'
          }
          defaultColorblind={cookieStore.get('colorblind')?.value === 'true'}
        >
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}

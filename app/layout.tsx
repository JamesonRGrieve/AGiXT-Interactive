import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head';

import ThemeWrapper from './theme';
import './globals.css'
import { AppBar } from '@mui/material';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JRG Next.js Boilerplate',
  description: 'Boilerplate for Next.JS Applications',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { NEXT_PUBLIC_WEBSITE_NAME } = process.env;
  return (
    <html lang='en'>
      <Head key={"env"}>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/__env.js" />
      </Head>
      <body className={inter.className}>
        <ThemeWrapper>
          <AppBar position='static' sx={{ textAlign: 'center', height: '4rem', fontSize: '2rem', lineHeight: '4rem' }}>{NEXT_PUBLIC_WEBSITE_NAME}</AppBar>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}

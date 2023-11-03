import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head';
import { cookies } from 'next/headers'
import ThemeWrapper from './theme';
import './globals.css'
import { AppBar, Box, Typography } from '@mui/material';
import SwitchColorblind from '@/components/styled/Switch/SwitchColorblind';
import SwitchDark from '@/components/styled/Switch/SwitchDark';

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
  const cookieStore = cookies();
  return (
    <html lang='en'>
      <Head key={"env"}>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/__env.js" />
      </Head>
      <body className={inter.className}>
        <ThemeWrapper defaultDark={cookieStore.get("dark")?.value === "true"} defaultColorblind={cookieStore.get("colorblind")?.value === "true"}>
          <AppBar position='static' sx={{ textAlign: 'center', height: '4rem', fontSize: '2rem', lineHeight: '4rem', display: 'flex', flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}><Typography variant="h1">{process.env.NEXT_PUBLIC_WEBSITE_NAME}</Typography><Box><SwitchDark /><SwitchColorblind /></Box></AppBar>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}

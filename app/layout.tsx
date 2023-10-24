import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ThemeRegistry } from './theme';
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
  return (
    <html lang='en'>
    <body className={inter.className}>
        <ThemeRegistry options={{ key: 'mui' }}>
            <AppBar position='static'>Test</AppBar>
            {children}
        </ThemeRegistry>
    </body>
  </html>
  );
}

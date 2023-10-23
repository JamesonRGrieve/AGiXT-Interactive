import type { Metadata } from 'next'
import {ThemeRegistry} from './theme';
import { Inter } from 'next/font/google'
import './globals.css'

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
            {children}
        </ThemeRegistry>
    </body>
  </html>
  );
}

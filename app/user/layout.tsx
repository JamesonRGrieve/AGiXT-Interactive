import React, { ReactNode } from 'react';

export default function UserLayout({ children }: { children: ReactNode }): ReactNode {
  return <div className='w-full h-full'>{children}</div>;
}

'use client';

import { IconButton } from '@mui/material';

export function MessageIcons({ children, ...props }: any) {
  return (
    <IconButton {...props} className='text-gray-500 dark:text-gray-300'>
      {children}
    </IconButton>
  );
}

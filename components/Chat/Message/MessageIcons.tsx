'use client';

import { IconButton } from '@mui/material';

export function MessageIcons({ children, ...props }: any) {
  return (
    <IconButton {...props} className='text-muted-foreground'>
      {children}
    </IconButton>
  );
}

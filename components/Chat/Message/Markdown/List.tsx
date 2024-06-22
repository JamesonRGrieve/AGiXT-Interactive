import { List } from '@mui/material';
import { ReactNode } from 'react';

export default function renderList({ children, ordered = true }): ReactNode {
  return (
    <List
      dense
      sx={{
        listStyle: ordered ? 'decimal' : 'disc',
        ml: '2rem',
        padding: '0',
      }}
    >
      {children}
    </List>
  );
}

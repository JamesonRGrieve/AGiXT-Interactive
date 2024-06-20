import { List } from '@mui/material';
import { ReactNode } from 'react';

export default function renderList({ children, ordered = true }): ReactNode {
  return (
    <List
      dense
      sx={{
        listStyle: ordered ? 'decimal' : 'disc',
        paddingLeft: ordered ? '3rem' : undefined,
      }}
    >
      {children}
    </List>
  );
}

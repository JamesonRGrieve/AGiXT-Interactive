import { ListItem } from '@mui/material';
import { ReactNode } from 'react';

export default function renderListItem({ children }): ReactNode {
  return <ListItem sx={{ display: 'list-item', paddingY: '0.2rem' }}>{children}</ListItem>;
}

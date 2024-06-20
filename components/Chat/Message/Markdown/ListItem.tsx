import { ReactNode } from 'react';

export default function renderListItem({ children }): ReactNode {
  return <li style={{ marginLeft: '1.2rem', marginBottom: '0.3rem' }}>{children}</li>;
}

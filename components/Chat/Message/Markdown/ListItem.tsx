import { ReactNode } from 'react';

export default function renderListItem({ children }): ReactNode {
  return <li style={{ marginBottom: '0.5em' }}>{children}</li>;
}

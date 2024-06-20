import { ReactNode } from 'react';

export default function renderList({ children, ordered = true }): ReactNode {
  return ordered ? <ol style={{ marginLeft: '1rem' }}>{children}</ol> : <ul style={{ marginLeft: '1rem' }}>{children}</ul>;
}

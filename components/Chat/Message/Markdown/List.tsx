import { ReactNode } from 'react';

export default function renderList({ children, ordered = true }): ReactNode {
  return ordered ? <ol style={{ paddingLeft: '2em' }}>{children}</ol> : <ul>{children}</ul>;
}

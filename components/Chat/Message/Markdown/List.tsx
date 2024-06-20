import { ReactNode } from 'react';

export default function renderList({ children, ordered = true }): ReactNode {
  return ordered ? <ol>{children}</ol> : <ul>{children}</ul>;
}

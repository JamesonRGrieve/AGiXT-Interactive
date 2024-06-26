import { Link } from '@mui/material';
import { ReactNode } from 'react';

const handleAnchorClick = (e): void => {
  const href = e.target.getAttribute('href');
  if (href.startsWith('#')) {
    e.preventDefault();
    const id = href.slice(1);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

export default function MarkdownLink({ children, ...props }): ReactNode {
  const isExternal = props.href && !props.href.startsWith('#');
  return (
    <Link
      {...props}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={isExternal ? undefined : handleAnchorClick}
    >
      {children}
    </Link>
  );
}

import React, { ReactNode } from 'react';

const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
  const href = e.currentTarget.getAttribute('href');
  if (href?.startsWith('#')) {
    e.preventDefault();
    const id = href.slice(1);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

interface MarkdownLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function MarkdownLink({ children, href, className, ...props }: MarkdownLinkProps): ReactNode {
  const isExternal = href && !href.startsWith('#');

  return (
    <a
      href={href}
      className={`text-blue-600 hover:text-blue-800 underline ${className || ''}`}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={isExternal ? undefined : handleAnchorClick}
      {...props}
    >
      {children}
    </a>
  );
}

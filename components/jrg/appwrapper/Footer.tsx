import { cn } from '@/lib/utils';

type FooterProps = React.HTMLAttributes<HTMLHeadElement> & {};

export const Footer = ({ className, children, ...props }: FooterProps) => {
  return (
    <footer
      className={cn('flex items-center justify-between h-8 gap-4 px-4 border-b md:px-6 bg-muted', className)}
      {...props}
    >
      {children}
    </footer>
  );
};

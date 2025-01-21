import { cn } from '@/lib/utils';

type HeaderProps = React.HTMLAttributes<HTMLHeadElement> & {};

export const Header = ({ className, children, ...props }: HeaderProps) => {
  return (
    <header
      className={cn('sticky top-0 flex items-center justify-between h-16 gap-4 px-4 border-b md:px-6 bg-muted', className)}
      {...props}
    >
      {children}
    </header>
  );
};

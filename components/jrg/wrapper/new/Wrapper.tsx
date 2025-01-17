import { cn } from '@/lib/utils';

type WrapperProps = React.HTMLAttributes<HTMLDivElement> & {};

export function AppWrapper({ className, children, ...props }: WrapperProps) {
  return (
    <div className={cn('flex flex-col w-full min-h-screen', className)} {...props}>
      {children}
    </div>
  );
}

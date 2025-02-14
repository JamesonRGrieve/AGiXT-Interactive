import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export function SidebarHeader({ children }: { children: ReactNode }) {
  return (
    <header
      className='flex shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 w-full sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      style={{ paddingTop: 'env(safe-area-inset-top)', height: 'calc(3rem + env(safe-area-inset-top))' }}
    >
      <div className='flex items-center h-full md:hidden'>
        <SidebarTrigger className='size-10' />
        <Separator orientation='vertical' className='h-4' />
      </div>
      {children}
    </header>
  );
}

export function SidebarHeaderTitle({ className, children }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('mx-auto text-muted-foreground', className)}>{children}</span>;
}

export function SidebarMain({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <main
      className={cn('flex flex-col flex-1 gap-4', className)}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      {...props}
    >
      {children}
    </main>
  );
}

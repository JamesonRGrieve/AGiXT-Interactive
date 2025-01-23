import { LuMenu as Menu } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type MobileSideBarProps = React.HTMLAttributes<HTMLDivElement> & {
  side?: 'top' | 'bottom' | 'left' | 'right' | null | undefined;
};

export const MobileSideBar = ({ className, children, side = 'left', ...props }: MobileSideBarProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <span className='md:hidden'>
          <Button variant='outline' size='icon' className='bg-transparent rounded-lg shrink-0'>
            <Menu className='w-5 h-5' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </span>
      </SheetTrigger>
      <SheetContent side={side} className={cn('flex flex-col gap-6', className)} {...props}>
        {children}
      </SheetContent>
    </Sheet>
  );
};

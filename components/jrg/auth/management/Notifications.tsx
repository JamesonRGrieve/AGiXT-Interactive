'use client';
import { Separator } from '@/components/ui/separator';

export const Notifications = () => {
  return (
    <div>
      <div>
        <h3 className='text-lg font-medium'>Notifications</h3>
        <p className='text-sm text-muted-foreground'>Change your notification preferences</p>
      </div>
      <Separator className='my-4' />
    </div>
  );
};

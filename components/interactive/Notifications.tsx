import { useState } from 'react';
import { PiBellSimpleRingingFill } from 'react-icons/pi';
import { PiBell } from 'react-icons/pi';

import { SidebarMenuButton } from '@/components/ui/sidebar';

export function Notifications() {
  const [count, setCount] = useState(0);
  const Icon = count > 0 ? PiBellSimpleRingingFill : PiBell;

  return (
    <SidebarMenuButton>
      <span>
        <Icon className='w-5 h-5' />
      </span>
      <span>
        Notifications
        {count > 0 && ` ( ${count} )`}
      </span>
    </SidebarMenuButton>
  );
}

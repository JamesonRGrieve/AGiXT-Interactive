'use client';

import { useState } from 'react';
import ChainPanel from '@/components/interactive/Settings/chain/ChainPanel';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/layout/sidebar-header';
import { ChainDialog } from '@/components/interactive/Settings/chain/ChainDialog';

export default function ChainPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <>
      <SidebarHeader>
        <SidebarHeaderTitle>Chains</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain>
        <ChainPanel showCreateDialog={showCreateDialog} setShowCreateDialog={setShowCreateDialog} />
        <ChainDialog open={showCreateDialog} setOpen={setShowCreateDialog} />
      </SidebarMain>
    </>
  );
}

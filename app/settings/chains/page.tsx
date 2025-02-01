'use client';

import { useState } from 'react';
import ChainPanel from '@/components/interactive/Settings/chain/ChainPanel';
import { SidebarPage } from '@/components/jrg/appwrapper/SidebarPage';
import { ChainDialog } from '@/components/interactive/Settings/chain/ChainDialog';

export default function ChainPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <SidebarPage title='Chains'>
      <ChainPanel showCreateDialog={showCreateDialog} setShowCreateDialog={setShowCreateDialog} />
      <ChainDialog open={showCreateDialog} setOpen={setShowCreateDialog} />
    </SidebarPage>
  );
}

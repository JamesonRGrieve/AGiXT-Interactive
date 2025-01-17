'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import ChainPanel from '@/components/interactive/Settings/chain/ChainPanel';
import ChainEditor from '@/components/interactive/Settings/chain/ChainEditor';
import NewChainDialog from '@/components/interactive/Settings/chain/NewChainDialog';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/layout/sidebar-header';
import { Extensions } from '@/components/interactive/Settings/extensions';

export default function ChainPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const context = useInteractiveConfig();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <SidebarHeader>
        <SidebarHeaderTitle>Chains</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain>
        <ChainPanel
          showCreateDialog={showCreateDialog}
          setShowCreateDialog={setShowCreateDialog}
          context={context}
          searchParams={searchParams}
          pathname={pathname}
          router={router}
        />
        <ChainEditor />
        <NewChainDialog open={showCreateDialog} setOpen={setShowCreateDialog} />
      </SidebarMain>
    </>
  );
}

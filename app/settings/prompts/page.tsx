'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import PromptPanel from '@/components/interactive/Settings/prompt/PromptPanel';
import PromptAdmin from '@/components/interactive/Settings/prompt/PromptAdmin';
import NewPromptDialog from '@/components/interactive/Settings/prompt/PromptDialog';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/layout/sidebar-header';

export default function PromptPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const context = useInteractiveConfig();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <SidebarHeader>
        <SidebarHeaderTitle>Prompts</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain>
        <PromptPanel
          showCreateDialog={showCreateDialog}
          setShowCreateDialog={setShowCreateDialog}
          context={context}
          searchParams={searchParams}
          pathname={pathname}
          router={router}
        />
        <NewPromptDialog open={showCreateDialog} setOpen={setShowCreateDialog} />
      </SidebarMain>
    </>
  );
}

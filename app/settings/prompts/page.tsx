'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import PromptPanel from '@/components/interactive/Settings/prompt/PromptPanel';
import NewPromptDialog from '@/components/interactive/Settings/prompt/PromptDialog';
import { SidebarPage } from '@/components/jrg/appwrapper/SidebarPage';
import { SidebarContent } from '@/components/jrg/appwrapper/SidebarContentManager';

export default function PromptPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const context = useInteractiveConfig();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SidebarPage title='Prompts'>
      <PromptPanel
        showCreateDialog={showCreateDialog}
        setShowCreateDialog={setShowCreateDialog}
        context={context}
        searchParams={searchParams}
        pathname={pathname}
        router={router}
      />
      <NewPromptDialog open={showCreateDialog} setOpen={setShowCreateDialog} />
    </SidebarPage>
  );
}

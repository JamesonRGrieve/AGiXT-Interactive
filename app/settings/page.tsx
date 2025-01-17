import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/layout/sidebar-header';
import { Providers } from '@/components/interactive/Settings/providers';
import AgentPanel from '@/components/interactive/Settings/agent/AgentPanel';

export default function ProvidersPage() {
  return (
    <>
      <SidebarHeader>
        <SidebarHeaderTitle>Settings</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain>
        <AgentPanel />
        <Providers />
      </SidebarMain>
    </>
  );
}

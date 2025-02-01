import { Providers } from '@/components/interactive/Settings/providers';
import AgentPanel from '@/components/interactive/Settings/agent/AgentPanel';
import { SidebarPage } from '@/components/jrg/appwrapper/SidebarPage';

export default function ProvidersPage() {
  return (
    <SidebarPage title='Settings'>
      <AgentPanel />
      <Providers />
    </SidebarPage>
  );
}

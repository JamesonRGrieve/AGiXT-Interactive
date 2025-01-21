import { AppSidebar } from '@/components/jrg/appwrapper/nav/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/jrg/appwrapper/nav/sidebar-header';
import Team from '@/components/jrg/auth/management/Team';

export default function TeamPage() {
  return (
    <>
      <SidebarHeader>
        <SidebarHeaderTitle>Team Users</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain>
        <Team />
      </SidebarMain>
    </>
  );
}

import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/jrg/appwrapper/SidebarHeader';
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

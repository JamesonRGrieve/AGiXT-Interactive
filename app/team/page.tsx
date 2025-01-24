import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/jrg/appwrapper/SidebarHeader';
import Team from '@/components/jrg/auth/management/Team';
import TeamUsers from '@/components/jrg/auth/management/TeamUsers';

export default function TeamPage() {
  return (
    <>
      <SidebarHeader>
        <SidebarHeaderTitle>Team Management</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain>
        <Team />
        <TeamUsers />
      </SidebarMain>
    </>
  );
}

import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/layout/sidebar-header';
import TeamUsers from '@/components/jrg/auth/management/TeamUsers';

export default function TeamsUsersPage() {
  return (
    <>
      <SidebarHeader>
        <SidebarHeaderTitle>Team Users</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain>
        <TeamUsers />
      </SidebarMain>
    </>
  );
}

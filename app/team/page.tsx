import Team from '@/components/jrg/auth/management/Team';
import TeamUsers from '@/components/jrg/auth/management/TeamUsers';
import { SidebarPage } from '@/components/jrg/appwrapper/SidebarPage';

export default function TeamPage() {
  return (
    <SidebarPage title='Team Management'>
      <Team />
      <TeamUsers />
    </SidebarPage>
  );
}

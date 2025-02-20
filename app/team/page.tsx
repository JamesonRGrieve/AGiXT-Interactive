import { SidebarPage } from '@/components/jrg/appwrapper/SidebarPage';
import Team from '@/components/jrg/auth/management/Team';
import TeamUsers from '@/components/jrg/auth/management/TeamUsers';

export default function TeamPage() {
  return (
    <SidebarPage title='Team Management'>
      <div className='overflow-x-auto px-4'>
        <Team />
        <TeamUsers />
      </div>
    </SidebarPage>
  );
}

import { AppSidebar } from '@/components/jrg/appwrapper/nav/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/jrg/appwrapper/nav/sidebar-header';
import { Extensions } from '@/components/interactive/Settings/extensions';

export default function ExtensionsPage() {
  return (
    <>
      <SidebarHeader>
        <SidebarHeaderTitle>Extensions</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain>
        <Extensions />
      </SidebarMain>
    </>
  );
}

import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/layout/sidebar-header';
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

import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/jrg/appwrapper/SidebarHeader';
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

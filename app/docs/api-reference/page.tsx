import MarkdownBlock from '@/components/interactive/Chat/Message/MarkdownBlock';
import { AppSidebar } from '@/components/jrg/appwrapper/nav/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/jrg/appwrapper/nav/sidebar-header';

export default function APIReference() {
  const content = `See our [REST API Documentation](${process.env.NEXT_PUBLIC_AGIXT_SERVER}/redoc) for more information.`;
  return (
    <>
      <SidebarHeader>
        <SidebarHeaderTitle>API Reference</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain>
        <MarkdownBlock content={content} />
      </SidebarMain>
    </>
  );
}

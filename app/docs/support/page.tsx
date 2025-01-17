import MarkdownBlock from '@/components/interactive/Chat/Message/MarkdownBlock';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/layout/sidebar-header';

export default function SupportPage() {
  // Get the top level domain name from next_public_agixt_server
  const tld = process.env.NEXT_PUBLIC_AGIXT_SERVER.split('.').slice(-2).join('.');

  const content = `For support, email [support@${tld}](mailto:support@${tld}).`;
  return (
    <>
      <SidebarHeader>
        <SidebarHeaderTitle>Support</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain>
        <MarkdownBlock content={content} />
      </SidebarMain>
    </>
  );
}

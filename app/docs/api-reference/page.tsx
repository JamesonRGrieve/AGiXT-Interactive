import MarkdownBlock from '@/components/interactive/Chat/Message/MarkdownBlock';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/jrg/appwrapper/SidebarHeader';

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

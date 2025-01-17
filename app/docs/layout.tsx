import { SidebarInset } from '@/components/ui/sidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <SidebarInset>{children}</SidebarInset>;
}

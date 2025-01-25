import MarkdownBlock from '@/components/interactive/Chat/Message/MarkdownBlock';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/jrg/appwrapper/SidebarHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function SupportPage() {
  // Get the top level domain name from next_public_agixt_server
  const tld = process.env.NEXT_PUBLIC_AGIXT_SERVER.split('.').slice(-2).join('.');

  const content = `For support, email [support@${tld}](mailto:support@${tld}).`;
  return (
    <>
      <SidebarHeader>
        <SidebarHeaderTitle>Support</SidebarHeaderTitle>
      </SidebarHeader>
      <div className='mb-4'>
        <Alert>
          <AlertTitle>Early Access Software</AlertTitle>
          <AlertDescription>
            This is an early-access deployment of open-source software. You may encounter problems or &quot;bugs&quot;. If
            you do, please make note of your most recent actions and{' '}
            <Link
              className='text-info hover:underline'
              href='https://github.com/JamesonRGrieve/AGiXT-Interactive/issues/new?template=bug_report_prod.yml'
            >
              let us know by making a report here
            </Link>
            . Your understanding as we build towards the future is much appreciated.
          </AlertDescription>
        </Alert>
      </div>
      <SidebarMain>
        <MarkdownBlock content={content} />
      </SidebarMain>
    </>
  );
}

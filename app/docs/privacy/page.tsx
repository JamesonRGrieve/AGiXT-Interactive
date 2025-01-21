import fs from 'fs';
import path from 'path';
import MarkdownBlock from '@/components/interactive/Chat/Message/MarkdownBlock';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/jrg/appwrapper/SidebarHeader';

// Read privacy policy from a local file
function getPrivacyPolicy() {
  try {
    const filePath = path.join(process.cwd(), 'content', 'privacy-policy.md');
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading privacy policy:', error);
    return '# Privacy Policy\n\nUnable to load privacy policy.';
  }
}

export default function PrivacyPolicy() {
  const privacyPolicyContent = getPrivacyPolicy();

  return (
    <>
      <SidebarHeader>
        <SidebarHeaderTitle>Privacy Policy</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain>
        <MarkdownBlock content={privacyPolicyContent} />
      </SidebarMain>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/jrg/appwrapper/SidebarHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function SupportPage() {
  const { data: userData } = useUser();
  const [formData, setFormData] = useState({
    type: '',
    subject: '',
    user: '',
    platform: '',
    description: '',
    attachments: null as FileList | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      user: JSON.stringify(userData),
      platform: JSON.stringify(window.navigator.userAgent),
    };
    sendAsEmail(submissionData);
  };

  return (
    <>
      <SidebarHeader>
        <SidebarHeaderTitle>Support Request</SidebarHeaderTitle>
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

interface SubmissionData {
  type: string;
  subject: string;
  description: string;
  user: string;
  platform: string;
}

function sendAsEmail(submissionData: SubmissionData) {
  // Get the top level domain name from next_public_agixt_server
  const tld = process.env.NEXT_PUBLIC_AGIXT_SERVER?.split('.').slice(-2).join('.') || 'example.com';
  const emailAddress = `support@${tld}`;

  // Format the email body
  const emailBody = `
Type: ${submissionData.type}
Subject: ${submissionData.subject}

Description:
${submissionData.description}

User Info:
${submissionData.user || 'Not logged in'}

Platform info:
${submissionData.platform}
  `.trim();

  // Create mailto URL
  const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(submissionData.subject)}&body=${encodeURIComponent(emailBody)}`;

  // Open the email client
  window.location.href = mailtoUrl;
}

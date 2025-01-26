'use client';

import { useEffect, useState } from 'react';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/jrg/appwrapper/SidebarHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import useUser from '@/components/jrg/auth/hooks/useUser';

const requestTypes = [
  { value: 'bug', label: 'Repot a Bug Report' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'billing', label: 'Billing Issue' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'other', label: 'Other' },
];

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
      <SidebarMain className='flex flex-col items-center justify-center'>
        <Card className='w-full max-w-lg border rounded-md'>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Support Request</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-1'>
                <Label htmlFor='type'>What type of support do you need?</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select request type' />
                  </SelectTrigger>
                  <SelectContent>
                    {requestTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.type && (
                <>
                  <div className='space-y-1'>
                    <Label htmlFor='subject'>Subject</Label>
                    <Input
                      id='subject'
                      placeholder='Brief description of the issue'
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className='space-y-1'>
                    <Label htmlFor='description'>Description</Label>
                    <Textarea
                      id='description'
                      placeholder='Please provide detailed information about your request'
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  {/* TODO: Add support endpoint that supports images. Mailto can't pass attachments */}
                  {/* <div>
                    <Label htmlFor='attachments'>Attachments (optional)</Label>
                    <Input
                      id='attachments'
                      type='file'
                      multiple
                      onChange={(e) => setFormData({ ...formData, attachments: e.target.files })}
                    />
                  </div> */}
                </>
              )}
            </CardContent>
            <CardFooter>
              {formData.type && (
                <Button type='submit' className='w-full m-auto'>
                  Submit Request
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
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

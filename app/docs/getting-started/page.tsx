'use client';

import {
  LuMic,
  LuPaperclip,
  LuBook,
  LuCommand,
  LuGraduationCap,
  LuHelpCircle,
  LuCopy,
  LuDownload,
  LuThumbsUp,
  LuThumbsDown,
  LuPen as LuEdit,
  LuTrash2,
  LuVolume2,
} from 'react-icons/lu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarHeader, SidebarHeaderTitle, SidebarMain } from '@/components/layout/sidebar-header';
import { Button } from '@/components/ui/button';
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
export default function GettingStartedPage() {
  const [hasStarted, setHasStarted] = useState(false);
  useEffect(() => {
    if (getCookie('agixt-has-started') === 'true') {
      setHasStarted(true);
    }
  }, [getCookie('agixt-has-started')]);
  return (
    <>
      <SidebarHeader>
        <SidebarHeaderTitle>Getting Started</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarMain>
        {/* Introduction */}
        <div className='max-w-3xl space-y-4'>
          <h1 className='text-4xl font-bold'>Welcome to {process.env.NEXT_PUBLIC_APP_NAME}!</h1>
          {/* {!hasStarted && (
              <Button
                size='lg'
                onClick={() => {
                  setCookie('agixt-has-started', 'true', {
                    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                  });
                }}
              >
                I Know What I'm Doing
              </Button>
            )} */}
          <p className='text-lg text-muted-foreground'>
            This guide will help you get started with our AI-powered chat interface and its powerful features.
          </p>
        </div>

        {/* Core Features */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <LuMic className='w-5 h-5' />
                <span>Text-to-Speech (TTS)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Enable voice interactions with your AI agent:</p>
              <ol className='mt-2 ml-4 space-y-2 list-decimal'>
                <li>Click the microphone icon in the bottom right of the chat input</li>
                <li>Speak your message clearly</li>
                <li>The AI will transcribe and respond to your voice input</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <LuPaperclip className='w-5 h-5' />
                <span>File Attachments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Share files with your AI agent:</p>
              <ol className='mt-2 ml-4 space-y-2 list-decimal'>
                <li>Click the paperclip icon in the bottom left of the chat input</li>
                <li>Select files to upload (images, documents, etc.)</li>
                <li>The AI will process and respond to the content of your files</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <LuBook className='w-5 h-5' />
                <span>Agent Extensions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Enhance your agent's capabilities:</p>
              <ol className='mt-2 ml-4 space-y-2 list-decimal'>
                <li>Access extensions from Settings → Extensions</li>
                <li>Enable or configure available extensions</li>
                <li>Use extended capabilities in your conversations</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Features */}
        <div className='space-y-6'>
          <h2 className='text-2xl font-bold'>Advanced Features</h2>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <LuCommand className='w-5 h-5' />
                <span>Agent Commands</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='mb-4'>Enhance your agent's capabilities:</p>
              <ol className='ml-4 space-y-2 list-decimal'>
                <li>Access extensions from Settings → Extensions</li>
                <li>Enable or configure available extensions</li>
                <li>Enable specific commands that you want your agent to execute autonomously on your behalf</li>
                <li>Use extended capabilities in your conversations through natural language requests</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <LuGraduationCap className='w-5 h-5' />
                <span>Agent Training</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='mb-4'>
                Improve your agent's performance and ensure it understands expectations clearly when interacting with users:
              </p>
              <ol className='ml-4 space-y-2 list-decimal'>
                <li>Navigate to Settings → Training</li>
                <li>Upload training documents or provide direct instructions</li>
                <li>
                  Set Mandatory Context to better guide the agent's responses, such as making sure every response comes with
                  lesson for learning another language.
                </li>
                <li>
                  <div className='flex items-center gap-1'>
                    Use the feedback system (
                    <LuThumbsUp />
                    <LuThumbsDown /> in the chat) to help the agent learn from interactions.
                  </div>
                </li>
                <li>Monitor agent performance and adjust training as needed</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </SidebarMain>
    </>
  );
}
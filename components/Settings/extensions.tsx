'use client';

import React, { useState, useEffect } from 'react';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { LuUnlink as Unlink } from 'react-icons/lu';
import { ConnectedServices } from '@/components/jrg/auth/management/ConnectedServices';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Wrench, Plus, MinusCircle } from 'lucide-react';
import MarkdownBlock from '@/components/interactive/Chat/Message/MarkdownBlock';
import { cn } from '@/lib/utils';

// Types remain the same
type Command = {
  friendly_name: string;
  description: string;
  command_name: string;
  command_args: Record<string, string>;
  enabled?: boolean;
  extension_name?: string;
};

type Extension = {
  extension_name: string;
  description: string;
  settings: string[];
  commands: Command[];
};

type ErrorState = {
  type: 'success' | 'error';
  message: string;
} | null;

interface ExtensionSettings {
  agent_name: string;
  settings: Record<string, string>;
}

export function Extensions() {
  const { agent } = useInteractiveConfig();
  const pathname = usePathname();
  const router = useRouter();
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [selectedExtension, setSelectedExtension] = useState<string>('');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>(null);
  const [showEnabledOnly, setShowEnabledOnly] = useState(false);
  const agent_name = (getCookie('agixt-agent') || process.env.NEXT_PUBLIC_AGIXT_AGENT) ?? agent;

  // Filter extensions for the enabled commands view
  const extensionsWithCommands = extensions.filter((ext) => ext.commands?.length > 0);
  const allEnabledCommands = extensions.flatMap((ext) =>
    ext.commands.filter((cmd) => cmd.enabled).map((cmd) => ({ ...cmd, extension_name: ext.extension_name })),
  );

  // Categorize extensions for the available tab
  const categorizeExtensions = (exts: Extension[]) => {
    return {
      // Connected extensions are those with settings and at least one command
      connectedExtensions: exts.filter((ext) => ext.settings?.length > 0 && ext.commands?.length > 0),
      // Available extensions are those with settings that aren't connected yet
      availableExtensions: exts.filter((ext) => ext.settings?.length > 0 && !ext.commands?.length),
    };
  };

  // Fetch extensions
  const fetchExtensions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        pathname.includes('company')
          ? `${process.env.NEXT_PUBLIC_AGIXT_SERVER}/v1/companies/${getCookie('agixt-company-id')}/extensions`
          : `${process.env.NEXT_PUBLIC_AGIXT_SERVER}/api/agent/${agent_name}/extensions`,
        {
          headers: {
            Authorization: getCookie('jwt'),
          },
        },
      );

      if (response.data?.extensions) {
        setExtensions(response.data.extensions);
      } else {
        throw new Error('Invalid extensions data received');
      }
    } catch (error: any) {
      console.error('Failed to fetch extensions:', error);
      setError({
        type: 'error',
        message: `Failed to load extensions: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExtensions();
  }, [agent_name]);

  const handleToggleCommand = async (commandName: string, enabled: boolean) => {
    try {
      const result = await axios.patch(
        pathname.includes('company')
          ? `${process.env.NEXT_PUBLIC_AGIXT_SERVER}/v1/companies/${getCookie('agixt-company-id')}/command`
          : `${process.env.NEXT_PUBLIC_AGIXT_SERVER}/api/agent/${agent_name}/command`,

        {
          command_name: commandName,
          enable: enabled,
        },
        {
          headers: {
            Authorization: getCookie('jwt'),
          },
        },
      );

      if (result.status === 200) {
        setExtensions((prev) =>
          prev.map((ext) => ({
            ...ext,
            commands: ext.commands.map((cmd) => (cmd.friendly_name === commandName ? { ...cmd, enabled } : cmd)),
          })),
        );
      }
    } catch (error) {
      console.error('Failed to toggle command:', error);
      setError({
        type: 'error',
        message: 'Failed to toggle command. Please try again.',
      });
    }
  };

  const handleSaveSettings = async (extensionName: string, settings: Record<string, string>) => {
    try {
      setError(null);
      const response = await axios.put<{ status: number; data: any }>(
        `${process.env.NEXT_PUBLIC_AGIXT_SERVER}/api/agent/${agent_name}`,
        {
          agent_name: agent_name,
          settings: settings,
        } as ExtensionSettings,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: getCookie('jwt'),
          },
        },
      );

      if (response.status === 200) {
        setError({
          type: 'success',
          message: 'Extension connected successfully!',
        });
        window.location.reload();
      }
    } catch (error: any) {
      setError({
        type: 'error',
        message: error.response?.data?.detail || error.message || 'Failed to connect extension',
      });
    }
  };

  const handleDisconnect = async (extension: Extension) => {
    const emptySettings = extension.settings.reduce((acc, setting) => ({ ...acc, [setting]: '' }), {});
    await handleSaveSettings(extension.extension_name, emptySettings);
  };

  if (loading && extensions.length === 0) {
    return <div className='p-4 text-center'>Loading extensions...</div>;
  }

  const { connectedExtensions, availableExtensions } = categorizeExtensions(extensions);

  return (
    <div className='space-y-6'>
      <Tabs defaultValue='enabled' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='enabled'>Manage Commands</TabsTrigger>
          <TabsTrigger value='available'>Manage Extensions</TabsTrigger>
        </TabsList>

        <TabsContent value='enabled' className='space-y-4'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-medium'>Enabled Commands</h3>
            <div className='flex items-center gap-2'>
              <Label htmlFor='show-enabled-only'>Show Enabled Only</Label>
              <Switch id='show-enabled-only' checked={showEnabledOnly} onCheckedChange={setShowEnabledOnly} />
            </div>
          </div>

          {extensionsWithCommands.length === 0 ? (
            <Alert>
              <AlertDescription>No extensions are currently enabled. Enable extensions to see them here.</AlertDescription>
            </Alert>
          ) : (
            <div className='grid gap-4'>
              {extensionsWithCommands
                .sort((a, b) => a.extension_name.localeCompare(b.extension_name))
                .map((extension) => (
                  <Card key={extension.extension_name}>
                    <CardHeader>
                      <CardTitle>{extension.extension_name}</CardTitle>
                      <CardDescription>
                        <MarkdownBlock content={extension.description || 'No description available'} />
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      {extension.commands
                        .filter((command) => !showEnabledOnly || command.enabled)
                        .map((command) => (
                          <Card key={command.command_name} className='p-4 border border-border/50'>
                            <div className='flex items-center mb-2'>
                              <Switch
                                checked={command.enabled}
                                onCheckedChange={(checked) => handleToggleCommand(command.friendly_name, checked)}
                              />
                              <h4 className='text-lg font-medium'>&nbsp;&nbsp;{command.friendly_name}</h4>
                            </div>
                            <MarkdownBlock content={command.description?.split('\nArgs')[0] || 'No description available'} />
                          </Card>
                        ))}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='available' className='space-y-4'>
          {/* OAuth Connected Services */}
          {!pathname.includes('company') && <ConnectedServices />}

          {/* Extensions */}
          <div className='grid gap-4'>
            {connectedExtensions.map((extension) => (
              <div
                key={extension.extension_name}
                className='flex flex-col gap-4 p-4 transition-colors border rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
              >
                <div className='flex items-center gap-4'>
                  <div className='flex items-center flex-1 min-w-0 gap-3.5'>
                    <Wrench className='flex-shrink-0 w-5 h-5 text-muted-foreground' />
                    <div>
                      <h4 className='font-medium truncate'>{extension.extension_name}</h4>
                      <p className='text-sm text-muted-foreground'>Connected</p>
                    </div>
                  </div>
                  <Button variant='outline' size='sm' className='gap-2' onClick={() => handleDisconnect(extension)}>
                    <Unlink className='w-4 h-4' />
                    Disconnect
                  </Button>
                </div>
                <div className='text-sm text-muted-foreground'>
                  <MarkdownBlock content={extension.description} />
                </div>
              </div>
            ))}

            {availableExtensions.map((extension) => (
              <div
                key={extension.extension_name}
                className='flex flex-col gap-4 p-4 transition-colors border rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
              >
                <div className='flex items-center gap-4'>
                  <div className='flex items-center flex-1 min-w-0 gap-3.5'>
                    <Wrench className='flex-shrink-0 w-5 h-5 text-muted-foreground' />
                    <div>
                      <h4 className='font-medium truncate'>{extension.extension_name}</h4>
                      <p className='text-sm text-muted-foreground'>Not Connected</p>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        className='gap-2'
                        onClick={() => {
                          setSelectedExtension(extension.extension_name);
                          setSettings(extension.settings.reduce((acc, setting) => ({ ...acc, [setting]: '' }), {}));
                        }}
                      >
                        <Plus className='w-4 h-4' />
                        Connect
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[425px]'>
                      <DialogHeader>
                        <DialogTitle>Configure {extension.extension_name}</DialogTitle>
                        <DialogDescription>Enter the required credentials to enable this service.</DialogDescription>
                      </DialogHeader>

                      <div className='grid gap-4 py-4'>
                        {extension.settings.map((setting) => (
                          <div key={setting} className='grid gap-2'>
                            <Label htmlFor={setting}>{setting}</Label>
                            <Input
                              id={setting}
                              type={
                                setting.toLowerCase().includes('key') || setting.toLowerCase().includes('password')
                                  ? 'password'
                                  : 'text'
                              }
                              value={settings[setting] || ''}
                              onChange={(e) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  [setting]: e.target.value,
                                }))
                              }
                              placeholder={`Enter ${setting.toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>

                      <DialogFooter>
                        <Button onClick={() => handleSaveSettings(extension.extension_name, settings)}>
                          Connect Extension
                        </Button>
                      </DialogFooter>

                      {error && (
                        <Alert variant={error.type === 'success' ? 'default' : 'destructive'}>
                          <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
                <div className='text-sm text-muted-foreground'>
                  <MarkdownBlock content={extension.description || 'No description available'} />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Extensions;

'use client';

import React, { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LuUnlink as Unlink } from 'react-icons/lu';
import { Wrench, Plus } from 'lucide-react';
import { useCompany, useAgent, useProviders } from '../hooks';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import MarkdownBlock from '@/components/interactive/Chat/Message/MarkdownBlock';

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

export function Providers() {
  const { agent } = useInteractiveConfig();
  const pathname = usePathname();
  const { data: agentData } = useAgent();
  const router = useRouter();
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [selectedExtension, setSelectedExtension] = useState<string>('');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [error, setError] = useState<ErrorState>(null);
  const [showEnabledOnly, setShowEnabledOnly] = useState(false);
  const agent_name = (getCookie('agixt-agent') || process.env.NEXT_PUBLIC_AGIXT_AGENT) ?? agent;
  const { data: activeCompany } = useCompany();
  const { data: providerData } = useProviders();
  const searchParams = useSearchParams();
  // Filter extensions for the enabled commands view
  const extensionsWithCommands = extensions.filter((ext) => ext.commands?.length > 0);
  const allEnabledCommands = extensions.flatMap((ext) =>
    ext.commands.filter((cmd) => cmd.enabled).map((cmd) => ({ ...cmd, extension_name: ext.extension_name })),
  );
  console.log('ACTIVE COMPANY', activeCompany);
  const categorizeProviders = (providers: any[]) => {
    console.log(agentData);
    const connected = providers.filter(
      (provider) =>
        provider.settings &&
        Object.entries(provider.settings).every(
          ([key, defaultValue]) =>
            !['KEY', 'SECRET', 'PASSWORD', 'TOKEN'].some((this_key) => key.endsWith(this_key)) ||
            (['KEY', 'SECRET', 'PASSWORD', 'TOKEN'].some((this_key) => key.endsWith(this_key)) &&
              agentData?.settings[key] &&
              agentData?.settings[key] === 'HIDDEN'),
        ),
    );
    return agentData && agentData.settings
      ? {
          // Connected providers have all their settings fields present with non-default values
          connectedProviders: connected,
          // Available providers are those that have settings but at least one field is missing or has default value
          availableProviders: providers.filter((provider) => !connected.includes(provider)),
        }
      : {
          connectedProviders: [],
          availableProviders: [],
        };
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

  console.log('PROVIDERS', providerData);

  const { connectedProviders, availableProviders } = categorizeProviders(providerData);
  console.log(connectedProviders, availableProviders);
  return (
    <div className='space-y-6'>
      <div className='grid gap-4'>
        {connectedProviders.map((provider) => (
          <div
            key={provider.name}
            className='flex flex-col gap-4 p-4 transition-colors border rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
          >
            <div className='flex items-center gap-4'>
              <div className='flex items-center flex-1 min-w-0 gap-3.5'>
                <Wrench className='flex-shrink-0 w-5 h-5 text-muted-foreground' />
                <div>
                  <h4 className='font-medium truncate'>{provider.name}</h4>
                  <p className='text-sm text-muted-foreground'>Connected</p>
                </div>
              </div>
              <Button variant='outline' size='sm' className='gap-2' onClick={() => handleDisconnect(provider.name)}>
                <Unlink className='w-4 h-4' />
                Disconnect
              </Button>
            </div>
            <div className='text-sm text-muted-foreground'>
              <MarkdownBlock content={provider.description} />
            </div>
          </div>
        ))}

        {availableProviders.map((provider) => (
          <div
            key={provider.name}
            className='flex flex-col gap-4 p-4 transition-colors border rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
          >
            <div className='flex items-center gap-4'>
              <div className='flex items-center flex-1 min-w-0 gap-3.5'>
                <Wrench className='flex-shrink-0 w-5 h-5 text-muted-foreground' />
                <div>
                  <h4 className='font-medium truncate'>{provider.friendlyName}</h4>
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
                      setSelectedExtension(provider.name);
                      // Initialize settings with the default values from provider.settings
                      setSettings(
                        Object.entries(provider.settings).reduce(
                          (acc, [key, defaultValue]) => ({
                            ...acc,
                            [key]: defaultValue,
                          }),
                          {},
                        ),
                      );
                    }}
                  >
                    <Plus className='w-4 h-4' />
                    Connect
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                  <DialogHeader>
                    <DialogTitle>Configure {provider.name}</DialogTitle>
                    <DialogDescription>
                      Enter the required credentials to enable this service. {provider.description}
                    </DialogDescription>
                  </DialogHeader>

                  <div className='grid gap-4 py-4'>
                    {Object.entries(provider.settings).map(([key, defaultValue]) => (
                      <div key={key} className='grid gap-2'>
                        <Label htmlFor={key}>{key}</Label>
                        <Input
                          id={key}
                          type={
                            key.toLowerCase().includes('key') || key.toLowerCase().includes('password') ? 'password' : 'text'
                          }
                          defaultValue={defaultValue}
                          value={settings[key]}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          placeholder={`Enter ${key.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>

                  <DialogFooter>
                    <Button onClick={() => handleSaveSettings(provider.name, settings)}>Connect Provider</Button>
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
              <MarkdownBlock content={provider.description || 'No description available'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Providers;

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAgent, useProviders } from '../../hooks';

export default function AgentConfigure() {
  const context = useInteractiveConfig();
  const searchParams = useSearchParams();
  const agentName = searchParams.get('agent') ?? '';
  const { data: agentData, mutate } = useAgent(agentName);
  const { data: providersData } = useProviders();

  const [provider, setProvider] = useState(agentData?.settings?.provider || '');
  const [agentState, setAgentState] = useState<any>(agentData);

  useEffect(() => {
    if (agentData) {
      setProvider(agentData.settings.provider);
      setAgentState(agentData);
    }
  }, [agentData]);

  const handleConfigure = async () => {
    await context.agixt.updateAgentSettings(agentName, {
      provider: provider,
      ...agentState,
    });
    mutate();
  };

  const renderFields = (dictionary) => {
    return (
      dictionary &&
      Object.entries(dictionary).map(([key, value]) => (
        <div key={key} className='mb-4'>
          <Label htmlFor={key}>{key}</Label>
          <Input
            id={key}
            value={value as string}
            onChange={(e) => setAgentState({ ...agentState, [key]: e.target.value })}
          />
        </div>
      ))
    );
  };

  const renderFieldsNested = (dictionary) => {
    return (
      dictionary &&
      Object.entries(dictionary).map(([key, value]) => (
        <Card key={key} className='mb-4'>
          <CardContent>
            <h3 className='text-lg font-semibold mb-2'>{key}</h3>
            {renderFields(value)}
          </CardContent>
        </Card>
      ))
    );
  };

  if (!agentData) return <div>Loading...</div>;

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 gap-4'>
        {renderFields({
          ...agentData.agentSettings,
          ...Object.keys(agentData.agentSettings || {}).reduce((acc, key) => {
            if (key in (agentData.settings || {})) acc[key] = agentData.settings[key];
            return acc;
          }, {}),
        })}
      </div>
      <div>
        <h2 className='text-xl font-semibold mb-2'>{provider} Provider Settings</h2>
        <div className='grid grid-cols-2 gap-4'>
          {renderFields({
            ...agentData.providerSettings,
            ...Object.keys(agentData.providerSettings || {}).reduce((acc, key) => {
              if (key in (agentData.settings || {})) acc[key] = agentData.settings[key];
              return acc;
            }, {}),
          })}
        </div>
      </div>
      <div>
        <h2 className='text-xl font-semibold mb-2'>Extension Settings</h2>
        {renderFieldsNested({
          ...agentData.extensionSettings,
          ...Object.keys(agentData.extensionSettings || {}).reduce((acc, key) => {
            if (key in (agentData.settings || {})) acc[key] = agentData.settings[key];
            return acc;
          }, {}),
        })}
      </div>
      <Button onClick={handleConfigure}>Save Agent Configuration</Button>
    </div>
  );
}

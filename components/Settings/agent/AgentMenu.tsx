'use client';

import { useSearchParams } from 'next/navigation';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAgentCommands } from '../../hooks';
import { mutate } from 'swr';

export default function AgentMenu() {
  const context = useInteractiveConfig();
  const searchParams = useSearchParams();
  const agentName = searchParams.get('agent') ?? '';
  const { data: commandData } = useAgentCommands(agentName);

  const handleToggleAll = async () => {
    const allEnabled = Object.values(commandData).every((command) => command);
    await context.agixt.toggleCommand(agentName, '*', !allEnabled);
    mutate(`/agent/commands?agent=${agentName}`);
  };

  return (
    <Card>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Label htmlFor='toggle-all'>All Commands</Label>
          <Switch
            id='toggle-all'
            checked={commandData && Object.values(commandData).every((command) => command)}
            onCheckedChange={handleToggleAll}
          />
        </div>
        {commandData &&
          Object.entries(commandData)
            .sort()
            .map(([command, enabled]) => (
              <AgentMenuItem key={command} name={command} enabled={enabled} agentName={agentName} />
            ))}
      </CardContent>
    </Card>
  );
}

function AgentMenuItem({ name, enabled, agentName }) {
  const context = useInteractiveConfig();

  const handleToggle = async () => {
    await context.agixt.toggleCommand(agentName, name, !enabled);
    mutate(`/agent/commands?agent=${agentName}`);
  };

  return (
    <div className='flex items-center justify-between'>
      <Label htmlFor={`toggle-${name}`}>{name}</Label>
      <Switch id={`toggle-${name}`} checked={enabled} onCheckedChange={handleToggle} />
    </div>
  );
}

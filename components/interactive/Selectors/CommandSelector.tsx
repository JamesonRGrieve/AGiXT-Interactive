'use client';

import { useAgentCommands } from '../hooks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CommandSelector({
  agentName,
  value,
  mutate,
}: {
  agentName: string;
  value: string;
  mutate: (value: string) => void;
}) {
  const { data: commandData } = useAgentCommands(agentName);

  return (
    <Select value={value} onValueChange={mutate} disabled={!commandData}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select a Command' />
      </SelectTrigger>
      <SelectContent>
        {commandData &&
          Object.keys(commandData).map(
            (c) =>
              c && (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ),
          )}
      </SelectContent>
    </Select>
  );
}

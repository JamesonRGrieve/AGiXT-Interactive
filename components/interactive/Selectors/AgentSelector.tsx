'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React, { useContext } from 'react';
import { InteractiveConfigContext } from '../InteractiveConfigContext';
import { useAgents } from '../hooks/useAgent';

export default function AgentSelector(): React.JSX.Element {
  const state = useContext(InteractiveConfigContext);
  const { data: agentData } = useAgents();
  return agentData && agentData?.length > 1 ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='w-full'>
            <Select
              disabled={agentData?.length === 0}
              value={state.agent}
              onValueChange={(value) =>
                state.mutate((oldState) => ({
                  ...oldState,
                  agent: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select an Agent' />
              </SelectTrigger>
              <SelectContent>
                {agentData.map((agent: any) => (
                  <SelectItem key={agent.id} value={agent.name}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Select an Agent</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <div className='w-full'>&nbsp;</div>
  );
}

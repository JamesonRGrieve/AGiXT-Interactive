'use client';

import { useState, useEffect } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import { ChevronsUpDown, Plus } from 'lucide-react';
import { createClient } from 'graphql-ws';
import { FaRobot } from 'react-icons/fa';
import { z } from 'zod';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useActiveCompany, useAgent, useAgents } from '../interactive/hooks';

const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  default: z.boolean(),
  companyId: z.string(),
});

const DataSchema = z.object({
  data: z.object({
    appState: z.object({
      state: z.object({
        user: z.object({
          companies: z.array(
            z.object({
              name: z.string(),
              agents: z.array(AgentSchema),
            }),
          ),
        }),
      }),
    }),
  }),
});

function extractAgentsFromData(data: unknown): Agent[] {
  const parseResult = DataSchema.safeParse(data);

  if (!parseResult.success) {
    console.error('Invalid data structure:', parseResult.error.errors);
    return [];
  }

  const companies = parseResult.data.data.appState.state.user.companies;

  return companies.flatMap((company) =>
    company.agents.map((agent) => ({
      ...agent,
      companyName: company.name,
    })),
  );
}

export function AgentSwitcher() {
  const { isMobile } = useSidebar('left');
  const { data: activeAgent, mutate: mutateActiveAgent } = useAgent();
  const { data: activeCompany, mutate: mutateActiveCompany } = useActiveCompany();
  const { data: agentsData } = useAgents();
  const [agentName, setAgentName] = useState();

  // Not amazing, but it's to fix hydration issues. Will need to look at better solutions
  useEffect(() => {
    setAgentName(getCookie('agixt-agent') ?? activeAgent?.name);
  }, [activeAgent]);

  const switchAgents = (agent: Agent) => {
    // setActiveAgent(agent);
    setCookie('agixt-agent', agent.name, {
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    });
    setCookie('agixt-company-id', agent.companyId, {
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    });
    mutateActiveAgent();
    mutateActiveCompany();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              side='left'
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex items-center justify-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground'>
                <FaRobot className='size-4' />
              </div>
              <div className='grid flex-1 text-sm leading-tight text-left'>
                <span className='font-semibold truncate'>{agentName}</span>
                <span className='text-xs truncate'>{activeCompany?.name}</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg px-2'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>Agents</DropdownMenuLabel>
            {agentsData &&
              agentsData.map((agent) => (
                <DropdownMenuItem key={agent.id} onClick={() => switchAgents(agent)} className='gap-2 p-2'>
                  <span>{agent.name}</span>
                  <span className='text-xs text-muted-foreground'>@ {agent.companyName}</span>
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2'>
              <div className='flex items-center justify-center border rounded-md size-6 bg-background'>
                <Plus className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>Add Agent</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

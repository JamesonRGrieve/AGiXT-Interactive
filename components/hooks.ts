import useSWR from 'swr';
import { useContext } from 'react';
import { InteractiveConfigContext } from './InteractiveConfigContext';
import { getAndFormatConversastion } from './Chat/Chat';
import { getCookie } from 'cookies-next';
import axios from 'axios';

// Hook for getting agents
export function useAgents() {
  const state = useContext(InteractiveConfigContext);
  return useSWR<string[]>(`/agent`, async () => ((await state.agixt.getAgents()) || []) as string[], {
    fallbackData: [],
  });
}

// Hook for getting chains
export function useChains() {
  const state = useContext(InteractiveConfigContext);
  return useSWR('/chains', async () => await state.agixt.getChains(), {
    fallbackData: [],
  });
}

// Hook for getting agent commands
export function useAgentCommands(agentName: string) {
  const state = useContext(InteractiveConfigContext);
  return useSWR(
    agentName ? `/agent/commands?agent=${agentName}` : null,
    async () => await state.agixt.getCommands(agentName),
    {
      fallbackData: [],
    },
  );
}

// Hook for getting current conversation
export function useConversation() {
  const state = useContext(InteractiveConfigContext);
  return useSWR(`/conversation/${state.overrides.conversation}`, async () => await getAndFormatConversastion(state), {
    fallbackData: [],
    refreshInterval: 10000,
  });
}

// Hook for getting prompt categories
export function usePromptCategories() {
  const state = useContext(InteractiveConfigContext);
  return useSWR('/prompts/categories', async () => await state.agixt.getPromptCategories(), {
    fallbackData: [],
  });
}

// Hook for getting prompts
export function usePrompts() {
  const state = useContext(InteractiveConfigContext);
  return useSWR<string[]>(
    `/prompt`,
    async () => (await state.agixt.getPrompts(state.overrides.promptCategory)) as string[],
    {
      fallbackData: [],
    },
  );
}
export function usePrompt() {
  const state = useContext(InteractiveConfigContext);
  return useSWR(
    `/prompt?category=${state.overrides?.promptCategory}&prompt=${state.overrides?.prompt}`,
    async () => await state.agixt.getPrompt(state.overrides?.prompt ?? '', state.overrides?.promptCategory),
    {
      fallbackData: 'Loading prompt.',
    },
  );
}
export function usePromptArgs(name?: string, category?: string) {
  const state = useContext(InteractiveConfigContext);
  console.log('Getting prompt args for ', name, category);
  name = name ?? state.overrides?.prompt ?? '';
  category = category ?? state.overrides?.promptCategory;
  console.log('Getting prompt args 2 for ', name, category);

  return useSWR(`/prompt_args/${category}/${name}`, async () => await state.agixt.getPromptArgs(name, category));
}
// New hook for getting a specific agent
export function useAgent(agentName: string | null) {
  const state = useContext(InteractiveConfigContext);
  return useSWR(
    agentName ? `/agent?agent=${agentName}` : null,
    async () => await state.agixt.getAgentConfig(agentName ?? ''),
    {
      fallbackData: null,
    },
  );
}

// New hook for getting providers
export function useProviders() {
  const state = useContext(InteractiveConfigContext);
  return useSWR('/providers', async () => await state.agixt.getProviders(), {
    fallbackData: [],
  });
}
export type Conversation = {
  name: string;
  has_notifications: boolean;
  created_at: string;
  updated_at: string;
};
type Conversations = Record<string, Conversation>;
// Hook for getting conversations
export function useConversations() {
  const state = useContext(InteractiveConfigContext);
  return useSWR<any[]>(
    `/conversation`,
    // Update SDK
    async () => {
      const conversations = await state.agixt.getConversations(true);
      // Convert conversations object to array with IDs
      const conversationsArray = Object.entries(conversations).map(([id, conv]) => ({
        id,
        ...conv,
      }));

      // Sort the array
      return conversationsArray.sort((a, b) => {
        // If one has notifications and the other doesn't, prioritize the one with notifications
        if (a.has_notifications !== b.has_notifications) {
          return a.has_notifications ? -1 : 1;
        }

        // If both have the same notification status, sort by updated_at
        const dateA = new Date(a.updated_at).getTime();
        const dateB = new Date(b.updated_at).getTime();
        return dateB - dateA; // Most recent first
      });
    },
    {
      fallbackData: [],
    },
  );
}

export function useActiveCompany() {
  const state = useContext(InteractiveConfigContext);
  return useSWR<string[]>(
    `/companies/active`,
    async () => {
      const companies = await state.agixt.getCompanies();
      const user = await axios.get(`${process.env.NEXT_PUBLIC_AGIXT_SERVER}/v1/user`, {
        headers: {
          Authorization: getCookie('jwt'),
        },
      });
      console.log('ACTIVE COMPANY USER', user);
      const target = companies.filter((company) => company.id === getCookie('agixt-company-id'))[0];
      console.log('ACTIVE COMPANY TARGET', target);
      console.log(
        'USER COMPANY',
        user.data.companies.filter((company) => company.id === getCookie('agixt-company-id')),
      );
      target.my_role = user.data.companies.filter((company) => company.id === getCookie('agixt-company-id'))[0].role_id;
      console.log('ACTIVE COMPANY TARGET AFTER', target);
      return target;
    },
    {
      fallbackData: [],
    },
  );
}
export function useCompanies() {
  const state = useContext(InteractiveConfigContext);
  return useSWR<string[]>(
    `/companies`,
    async () => {
      const companies = await state.agixt.getCompanies();
      return companies;
    },
    {
      fallbackData: [],
    },
  );
}

export function useInvitations(company_id?: string) {
  const state = useContext(InteractiveConfigContext);
  return useSWR<string[]>(
    company_id ? `/invitations/${company_id}` : '/invitations',
    async () => (await state.agixt.getInvitations(company_id)) as any[],
    {
      fallbackData: [],
    },
  );
}

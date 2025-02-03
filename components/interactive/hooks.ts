import { useContext } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import { GraphQLClient } from 'graphql-request';
import { InteractiveConfigContext, useInteractiveConfig } from './InteractiveConfigContext';
import useSWR, { SWRResponse } from 'swr';

// Import all types from the centralized schema file
import {
  User,
  UserSchema,
  Agent,
  AgentSchema,
  Company,
  CompanySchema,
  Prompt,
  PromptSchema,
  Provider,
  ProviderSchema,
  Invitation,
  CommandArgs,
  Chain,
  ChainSchema,
  Conversation,
  AppStateSchema,
  ConversationEdge,
  InvitationSchema,
  CommandArgSchema,
  PromptCategorySchema,
  ChainsSchema,
  ConversationMetadataSchema,
  ConversationMetadata,
  ConversationEdgeSchema,
  ConversationSchema,
} from './types';
import { z } from 'zod';
import log from '../jrg/next-log/log';
import axios from 'axios';
import { useToast } from '@/hooks/useToast';
import { create } from 'domain';
import { useRouter } from 'next/navigation';

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Creates a configured GraphQL client instance
 * @returns Configured GraphQLClient instance
 */
const createGraphQLClient = (): GraphQLClient =>
  new GraphQLClient(`${process.env.NEXT_PUBLIC_AGIXT_SERVER}/graphql`, {
    headers: { authorization: getCookie('jwt') || '' },
  });

/**
 * Helper to chain mutations between hooks
 * @param parentHook - Parent hook containing mutate function
 * @param currentHook - Current hook's mutate function
 */
const chainMutations = (parentHook: any, originalMutate: () => Promise<any>) => {
  return async () => {
    await parentHook.mutate();
    return originalMutate();
  };
};
// ============================================================================
// Agent Related Hooks
// ============================================================================

/**
 * Hook to fetch and manage all agents across companies
 * @returns SWR response containing array of agents
 */
export function useAgents(): SWRResponse<Agent[]> {
  const companiesHook = useCompanies();
  const { data: companies } = companiesHook;

  const swrHook = useSWR<Agent[]>(
    ['/agents', companies],
    (): Agent[] =>
      companies?.flatMap((company) =>
        company.agents.map((agent) => ({
          ...agent,
          companyName: company.name,
        })),
      ) || [],
    { fallbackData: [] },
  );

  const originalMutate = swrHook.mutate;
  swrHook.mutate = chainMutations(companiesHook, originalMutate);
  return swrHook;
}

/**
 * Hook to fetch and manage agent data and commands
 * @param name - Optional agent name to fetch
 * @returns SWR response containing agent data and commands
 */
export function useAgent(
  withSettings: boolean = false,
  name?: string,
): SWRResponse<{
  agent: Agent | null;
  commands: string[];
}> {
  const getDefaultAgent = () => {
    const primaryCompany = companies.find((c) => c.primary);
    if (primaryCompany?.agents?.length) {
      const primaryAgent = primaryCompany?.agents.find((a) => a.default);
      foundEarly = primaryAgent || primaryCompany?.agents[0];
      searchName = foundEarly?.name;
      setCookie('agixt-agent', searchName, {
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      });
    }
    return foundEarly;
  };
  const companiesHook = useCompanies();
  const { data: companies } = companiesHook;
  const state = useContext(InteractiveConfigContext);
  let searchName = name || (getCookie('agixt-agent') as string | undefined);
  let foundEarly = null;

  if (!searchName && companies?.length) {
    foundEarly = getDefaultAgent();
  }
  log([`GQL useAgent() SEARCH NAME: ${searchName}`], {
    client: 3,
  });
  const swrHook = useSWR<{ agent: Agent | null; commands: string[]; extensions: any[] }>(
    [`/agent?name=${searchName}`, companies, withSettings],
    async (): Promise<{ agent: Agent | null; commands: string[]; extensions: any[] }> => {
      try {
        if (withSettings) {
          const client = createGraphQLClient();
          const query = AgentSchema.toGQL('query', 'GetAgent', { name: searchName });
          log(['GQL useAgent() Query', query], {
            client: 3,
          });
          const response = await client.request<{ agent: Agent }>(query, { name: searchName });
          log(['GQL useAgent() Response', response], {
            client: 3,
          });
          return AgentSchema.parse(response.agent);
        } else {
          const toReturn = { agent: foundEarly, commands: [], extensions: [] };
          if (companies?.length && !toReturn.agent) {
            for (const company of companies) {
              log(['GQL useAgent() Checking Company', company], {
                client: 3,
              });
              const agent = company.agents.find((a) => a.name === searchName);
              if (agent) {
                toReturn.agent = agent;
              }
            }
          }
          if (!toReturn.agent) {
            log(['GQL useAgent() Agent Not Found, Using Default', toReturn], {
              client: 3,
            });
            toReturn.agent = getDefaultAgent();
          }
          if (toReturn.agent) {
            log(['GQL useAgent() Agent Found, Getting Commands', toReturn], {
              client: 3,
            });
            toReturn.extensions = (
              await axios.get(`${process.env.NEXT_PUBLIC_AGIXT_SERVER}/api/agent/${toReturn.agent.name}/extensions`, {
                headers: {
                  Authorization: getCookie('jwt'),
                },
              })
            ).data.extensions;
            toReturn.commands = await state.agixt.getCommands(toReturn.agent.name);
          } else {
            log(['GQL useAgent() Did Not Get Agent', toReturn], {
              client: 3,
            });
          }

          return toReturn;
        }
      } catch (error) {
        log(['GQL useAgent() Error', error], {
          client: 1,
        });
        return { agent: null, commands: [], extensions: [] };
      }
    },
    { fallbackData: { agent: null, commands: [], extensions: [] } },
  );
  const originalMutate = swrHook.mutate;
  swrHook.mutate = chainMutations(companiesHook, originalMutate);
  return swrHook;
}

// ============================================================================
// Prompt Related Hooks
// ============================================================================

/**
 * Hook to fetch and manage prompt categories
 * @returns SWR response containing array of prompt categories
 */
export function usePromptCategories(): SWRResponse<string[]> {
  const client = createGraphQLClient();

  return useSWR<string[]>(
    '/promptCategories',
    async (): Promise<string[]> => {
      try {
        const query = PromptCategorySchema.toGQL('query', 'GetPromptCategories');
        const response = await client.request(query);
        return response || [];
      } catch (error) {
        log(['GQL usePromptCategories() Error', error], {
          client: 1,
        });
        return [];
      }
    },
    { fallbackData: [] },
  );
}
/**
 * Hook to get a specific prompt by name from the prompts list
 * @param name - Name of the prompt to find
 * @returns SWR response containing prompt data if found
 */
export function usePrompt(name: string): SWRResponse<Prompt | null> & {
  delete: () => Promise<void>;
  rename: (newName: string) => Promise<void>;
  update: (content: string) => Promise<void>;
  export: () => Promise<void>;
} {
  const promptsHook = usePrompts();
  const { data: prompts, error: promptsError, isLoading: promptsLoading, mutate: promptsMutate } = promptsHook;
  const { agixt } = useInteractiveConfig();
  const { toast } = useToast();
  const router = useRouter();
  const swrHook = useSWR<Prompt | null>([name, prompts], () => prompts?.find((p) => p.name === name) || null, {
    fallbackData: null,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const isLoading = promptsLoading || swrHook.isLoading;
  const error = promptsError || swrHook.error;
  return Object.assign(
    { ...swrHook, isLoading, error },
    {
      delete: async () => {
        try {
          await agixt.deletePrompt(name);
          promptsMutate();
          router.push(`/settings/prompts?prompt=${(prompts && prompts.filter((p) => p.name !== name)[0]?.name) || ''}`);
          toast({
            title: 'Success',
            description: 'Prompt Deleted',
            duration: 5000,
          });
        } catch (error) {
          console.error(error);
          toast({
            title: 'Error',
            description: 'Failed to Delete Prompt',
            duration: 5000,
          });
          throw error;
        }
      },
      rename: async (newName: string) => {
        try {
          await agixt.renamePrompt(name, newName);
          swrHook.mutate();
          promptsMutate();
          toast({
            title: 'Success',
            description: 'Prompt Renamed',
            duration: 5000,
          });
        } catch (error) {
          console.error(error);
          toast({
            title: 'Error',
            description: 'Failed to Rename Prompt',
            duration: 5000,
          });
          throw error;
        }
      },
      update: async (content: string) => {
        try {
          await agixt.updatePrompt(name, content);
          swrHook.mutate();
          toast({
            title: 'Success',
            description: 'Prompt Updated',
            duration: 5000,
          });
        } catch (error) {
          console.error(error);
          toast({
            title: 'Error',
            description: 'Failed to Update Prompt',
            duration: 5000,
          });
          throw error;
        }
      },
      export: async () => {
        if (!swrHook.data) {
          toast({
            title: 'Error',
            description: 'No Active Prompt to Export',
            duration: 5000,
          });
          return;
        }
        const element = document.createElement('a');
        const file = new Blob([swrHook.data?.content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `AGiXT-Prompt-${name}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      },
    },
  );
}

/**
 * Hook to fetch and manage all prompts and categories
 * @returns SWR response containing prompts array and categories array with management functions
 */
export function usePrompts(): SWRResponse<Prompt[]> & {
  create: (name: string, content: string) => Promise<void>;
  import: (name: string, file: File) => Promise<void>;
} {
  const client = createGraphQLClient();
  const { toast } = useToast();
  const { agixt } = useInteractiveConfig();
  const router = useRouter();

  const swrHook = useSWR<Prompt[]>(
    '/prompts',
    async (): Promise<Prompt[]> => {
      try {
        const query = PromptSchema.toGQL('query', 'GetPrompts');
        const response = await client.request(query);
        return response.prompts || [];
      } catch (error) {
        log(['GQL usePrompts() Error', error], {
          client: 1,
        });
        return [];
      }
    },
    { fallbackData: [] },
  );

  return Object.assign(swrHook, {
    create: async (name: string, content: string) => {
      try {
        await agixt.addPrompt(name, content);
        swrHook.mutate();
        router.push(`/settings/prompts?prompt=${name}`);
        toast({
          title: 'Success',
          description: 'Prompt Created',
          duration: 5000,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to Create Prompt',
          duration: 5000,
        });
        console.error(error);
        throw error;
      }
    },
    import: async (name: string, file: File) => {
      name = name || file.name.replace('.json', '');
      await agixt.addPrompt(name, await file.text());
      router.push(`/settings/prompts?&prompt=${name}`);
    },
  });
}
// ============================================================================
// Company Related Hooks
// ============================================================================

/**
 * Hook to fetch and manage company data
 * @returns SWR response containing array of companies
 */
export function useCompanies(): SWRResponse<Company[]> {
  const userHook = useUser();
  const { data: user } = userHook;

  const swrHook = useSWR<Company[]>(['/companies', user], () => user?.companies || [], { fallbackData: [] });

  const originalMutate = swrHook.mutate;
  swrHook.mutate = chainMutations(userHook, originalMutate);

  return swrHook;
}

/**
 * Hook to fetch and manage specific company data
 * @param id - Optional company ID to fetch
 * @returns SWR response containing company data or null
 */
export function useCompany(id?: string): SWRResponse<Company | null> {
  const companiesHook = useCompanies();
  const { data: companies } = companiesHook;
  console.log('COMPANY THING');
  const swrHook = useSWR<Company | null>(
    [`/company?id=${id}`, companies, getCookie('jwt')],
    async (): Promise<Company | null> => {
      if (!getCookie('jwt')) return null;
      try {
        console.log('COMPANY THING 2');
        if (id) {
          console.log('COMPANY THING 3');
          return companies?.find((c) => c.id === id) || null;
        } else {
          console.log('COMPANY THING 4');
          log(['GQL useCompany() Companies', companies], {
            client: 1,
          });
          const agentName = getCookie('agixt-agent');
          log(['GQL useCompany() AgentName', agentName], {
            client: 1,
          });
          const targetCompany =
            companies?.find((c) => (agentName ? c.agents.some((a) => a.name === agentName) : c.primary)) || null;
          log(['GQL useCompany() Company', targetCompany], {
            client: 1,
          });
          targetCompany.extensions = (
            await axios.get(
              `${process.env.NEXT_PUBLIC_AGIXT_SERVER}/v1/companies/${targetCompany.id}/extensions`,

              {
                headers: {
                  Authorization: getCookie('jwt'),
                },
              },
            )
          ).data.extensions;
          log(['GQL useCompany() Company With Extensions', targetCompany], {
            client: 3,
          });
          return targetCompany;
        }
      } catch (error) {
        console.log('COMPANY THING 5');
        log(['GQL useCompany() Error', error], {
          client: 3,
        });
        return null;
      }
    },
    { fallbackData: null },
  );

  const originalMutate = swrHook.mutate;
  swrHook.mutate = chainMutations(companiesHook, originalMutate);

  return swrHook;
}

// ============================================================================
// User Related Hooks
// ============================================================================

/**
 * Hook to fetch and manage current user data
 * @returns SWR response containing user data
 */
export function useUser(): SWRResponse<User | null> {
  const client = createGraphQLClient();

  return useSWR<User | null>(
    ['/user', getCookie('jwt')],
    async (): Promise<User | null> => {
      if (!getCookie('jwt')) return null;
      try {
        const query = UserSchema.toGQL('query', 'GetUser');
        log(['GQL useUser() Query', query], {
          client: 3,
        });
        const response = await client.request<{ user: User }>(query);
        log(['GQL useUser() Response', response], {
          client: 3,
        });
        return UserSchema.parse(response.user);
      } catch (error) {
        log(['GQL useUser() Error', error], {
          client: 1,
        });
        return {
          companies: [],
          email: '',
          firstName: '',
          id: '',
          lastName: '',
        };
      }
    },
    {
      fallbackData: {
        companies: [],
        email: '',
        firstName: '',
        id: '',
        lastName: '',
      },
    },
  );
}

// ============================================================================
// Provider Related Hooks
// ============================================================================

/**
 * Hook to fetch and manage provider data
 * @param providerName - Optional provider name to fetch specific provider
 * @returns SWR response containing provider data
 */
export function useProvider(providerName?: string): SWRResponse<Provider | null> {
  const client = createGraphQLClient();

  return useSWR<Provider | null>(
    providerName ? [`/provider`, providerName] : null,
    async (): Promise<Provider | null> => {
      try {
        const query = ProviderSchema.toGQL('query', 'GetProvider', { providerName });
        const response = await client.request<Provider>(query, { providerName });
        const validated = ProviderSchema.parse(response);
        return validated.provider;
      } catch (error) {
        log(['GQL useProvider() Error', error], {
          client: 1,
        });
        return null;
      }
    },
    { fallbackData: null },
  );
}

/**
 * Hook to fetch and manage all providers
 * @returns SWR response containing array of providers
 */
export function useProviders(): SWRResponse<Provider[]> {
  const client = createGraphQLClient();

  return useSWR<Provider[]>(
    '/providers',
    async (): Promise<Provider[]> => {
      try {
        const query = ProviderSchema.toGQL('query', 'GetProviders');
        const response = await client.request<Provider[]>(query);
        log(['GQL useProviders() Response', response], {
          client: 3,
        });
        const validated = z.array(ProviderSchema).parse(response.providers);
        log(['GQL useProviders() Validated', validated], {
          client: 3,
        });
        return validated;
      } catch (error) {
        log(['GQL useProviders() Error', error], {
          client: 1,
        });
        return [];
      }
    },
    { fallbackData: [] },
  );
}

// ============================================================================
// Invitation Related Hooks
// ============================================================================

/**
 * Hook to fetch and manage invitations
 * @param companyId - Optional company ID to fetch invitations for
 * @returns SWR response containing array of invitations
 */
export function useInvitations(companyId?: string): SWRResponse<Invitation[]> {
  const client = createGraphQLClient();

  return useSWR<Invitation[]>(
    companyId ? [`/invitations`, companyId] : '/invitations',
    async (): Promise<Invitation[]> => {
      try {
        const query = InvitationSchema.toGQL('query', 'GetInvitations', { companyId });
        const response = await client.request<Invitation[]>(query, { companyId });
        const validated = InvitationSchema.parse(response);
        return validated.invitations;
      } catch (error) {
        log(['GQL useInvitations() Error', error], {
          client: 1,
        });
        return [];
      }
    },
    { fallbackData: [] },
  );
}

// ============================================================================
// Command Related Hooks
// ============================================================================

/**
 * Hook to fetch and manage command arguments
 * @param commandName - Command name to fetch arguments for
 * @returns SWR response containing command arguments
 */
export function useCommandArgs(commandName: string): SWRResponse<CommandArgs | null> {
  const client = createGraphQLClient();

  return useSWR<CommandArgs | null>(
    commandName ? [`/command_args`, commandName] : null,
    async (): Promise<CommandArgs | null> => {
      try {
        const query = CommandArgSchema.toGQL('query', 'GetCommandArgs', { commandName });
        const response = await client.request<CommandArgs>(query, { commandName });
        const validated = CommandArgSchema.parse(response);
        return validated;
      } catch (error) {
        log(['GQL useCommandArgs() Error', error], {
          client: 1,
        });
        return null;
      }
    },
    { fallbackData: null },
  );
}

// ============================================================================
// Chain Related Hooks
// ============================================================================

/**
 * Hook to fetch and manage chain data
 * @param chainName - Optional chain name to fetch specific chain
 * @returns SWR response containing chain data
 */
export function useChain(chainName?: string): SWRResponse<Chain | null> {
  const client = createGraphQLClient();

  return useSWR<Chain | null>(
    chainName ? [`/chain`, chainName] : null,
    async (): Promise<Chain | null> => {
      try {
        const query = ChainSchema.toGQL('query', 'GetChain', { chainName: chainName });
        log(['GQL useChain() Query', query], {
          client: 3,
        });
        const response = await client.request<{ chain: Chain }>(query, { chainName: chainName });
        log(['GQL useChain() Response', response], {
          client: 3,
        });
        const validated = ChainSchema.parse(response.chain);
        log(['GQL useChain() Validated', validated], {
          client: 3,
        });
        return validated;
      } catch (error) {
        log(['GQL useChain() Error', error], {
          client: 1,
        });
        return null;
      }
    },
    { fallbackData: null },
  );
}

/**
 * Hook to fetch and manage all chains
 * @returns SWR response containing array of chains
 */
export function useChains(): SWRResponse<Chain[]> {
  const client = createGraphQLClient();

  return useSWR<Chain[]>(
    '/chains',
    async (): Promise<Chain[]> => {
      try {
        const query = ChainsSchema.toGQL('query', 'GetChains');
        log(['GQL useChains() Query', query], {
          client: 3,
        });
        const response = await client.request<{ chains: Chain[] }>(query);
        log(['GQL useChains() Response', response], {
          client: 3,
        });
        const validated = z.array(ChainsSchema).parse(response.chains);
        log(['GQL useChains() Validated', validated], {
          client: 3,
        });
        return validated;
      } catch (error) {
        log(['GQL useChains() Error', error], {
          client: 1,
        });
        return [];
      }
    },
    { fallbackData: [] },
  );
}

// ============================================================================
// Conversation Related Hooks
// ============================================================================

// /**
//  * Hook to fetch and manage conversation data with real-time updates
//  * @param conversationId - Conversation ID to fetch
//  * @returns SWR response containing conversation data
//  */
// export function useAppState(conversationId: string): SWRResponse<Conversation | null> {
//   const client = createGraphQLClient();

//   return useSWR<Conversation | null>(
//     conversationId ? [`/conversation`, conversationId] : null,
//     async (): Promise<Conversation | null> => {
//       try {
//         const query = AppStateSchema.toGQL('subscription', 'appState', { conversationId });
//         log(['GQL useAppState() Query', query], {
//           client: 3,
//         });
//         const response = await client.request<Conversation>(query, { conversationId });
//         return response.conversation;
//       } catch (error) {
//         log(['GQL useAppState() Error', error], {
//           client: 1,
//         });
//         return null;
//       }
//     },
//     {
//       fallbackData: null,
//       refreshInterval: 1000, // Real-time updates
//     },
//   );
// }
// export function useConversation(conversationId: string): SWRResponse<Conversation | null> {
//   const client = createGraphQLClient();

//   return useSWR<Conversation | null>(
//     conversationId ? [`/conversation`, conversationId] : null,
//     async (): Promise<Conversation | null> => {
//       try {
//         const query = ConversationSchema.toGQL('query', 'conversation', { conversationId });
//         log(['GQL useConversation() Query', query], {
//           client: 3,
//         });
//         const response = await client.request<Conversation>(query, { conversationId });
//         return response.conversation;
//       } catch (error) {
//         log(['GQL useConversation() Error', error], {
//           client: 1,
//         });
//         return null;
//       }
//     },
//     {
//       fallbackData: null,
//       refreshInterval: 1000, // Real-time updates
//     },
//   );
// }
/**
 * Hook to fetch and manage all conversations with real-time updates
 * @returns SWR response containing array of conversation edges
 */
export function useConversations(): SWRResponse<ConversationEdge[]> {
  const client = createGraphQLClient();

  return useSWR<ConversationEdge[]>(
    '/conversations',
    async (): Promise<ConversationEdge[]> => {
      try {
        const query = z.object({ edges: ConversationEdgeSchema }).toGQL('query', 'GetConversations');
        log(['GQL useConversations() Query', query], {
          client: 3,
        });
        const response = await client.request<{ conversations: { edges: ConversationEdge[] } }>(query);
        return z.array(ConversationEdgeSchema).parse(response.conversations.edges);
      } catch (error) {
        log(['GQL useConversations() Error', error], {
          client: 1,
        });
        return [];
      }
    },
    { fallbackData: [] },
  );
}
export function useOldCompanies() {
  const state = useContext(InteractiveConfigContext);
  return useSWR<string[]>(
    `/companies`,
    async () => {
      return await state.agixt.getCompanies();
    },
    {
      fallbackData: [],
    },
  );
}

export function useOldInvitations(company_id?: string) {
  const state = useContext(InteractiveConfigContext);
  return useSWR<string[]>(
    company_id ? `/invitations/${company_id}` : '/invitations',
    async () => await state.agixt.getInvitations(company_id),
    {
      fallbackData: [],
    },
  );
}
export function useOldActiveCompany() {
  const state = useContext(InteractiveConfigContext);
  const { data: companyData } = useCompany();
  return useSWR<any>(
    [`/companies`, companyData?.id ?? null],
    async () => {
      const companies = await state.agixt.getCompanies();
      const user = await axios.get(`${process.env.NEXT_PUBLIC_AGIXT_SERVER}/v1/user`, {
        headers: {
          Authorization: getCookie('jwt'),
        },
      });
      console.log('ACTIVE COMPANY', companyData);
      console.log('ACTIVE COMPANY USER', user);
      console.log('ALL COMPANIES', companies);
      const target = companies.filter((company) => company.id === companyData.id)[0];
      console.log('ACTIVE COMPANY TARGET', target);
      console.log(
        'USER COMPANY',
        user.data.companies.filter((company) => company.id === companyData.id),
      );
      target.my_role = user.data.companies.filter((company) => company.id === companyData.id)[0].role_id;
      console.log('ACTIVE COMPANY TARGET AFTER', target);
      return target;
    },
    {
      fallbackData: [],
    },
  );
}

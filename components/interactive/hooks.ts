import { useContext } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import { GraphQLClient } from 'graphql-request';
import { InteractiveConfigContext } from './InteractiveConfigContext';
import useSWR, { SWRResponse } from 'swr';
import {
  UserSchema,
  AgentSchema,
  UserResponseSchema,
  User,
  Company,
  Agent,
  UserResponse,
  InvitationSchema,
  PromptsResponseSchema,
} from './types';
import {
  Chain,
  ChainSchema,
  ChainResponseSchema,
  ChainsResponseSchema,
  Conversation,
  ConversationSchema,
  ConversationEdge,
  ConversationsResponseSchema,
} from './types';
import {
  CommandArgs,
  CommandArgsResponseSchema,
  Prompt,
  PromptSchema,
  PromptResponseSchema,
  PromptCategoriesResponseSchema,
  Provider,
  ProviderSchema,
  ProviderResponseSchema,
  ProvidersResponseSchema,
  Invitation,
  InvitationsResponseSchema,
} from './types';
/**
 * Creates a configured GraphQL client instance
 * @returns Configured GraphQLClient instance
 */
const createGraphQLClient = (): GraphQLClient =>
  new GraphQLClient(`${process.env.NEXT_PUBLIC_AGIXT_SERVER}/graphql`, {
    headers: { authorization: getCookie('jwt') || '' },
  });

/**
 * Hook to fetch and manage current user data
 * @returns SWR response containing user data
 */
export function useUser(): SWRResponse<User> {
  const client = createGraphQLClient();

  return useSWR<User>(
    '/user',
    async (): Promise<User> => {
      const query = UserSchema.toGQL('query', 'GetUser');
      const response = await client.request<UserResponse>(query);
      const validated = UserResponseSchema.parse(response);
      return validated.data.user;
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

/**
 * Hook to fetch and manage company data
 * @returns SWR response containing array of companies
 */
export function useCompanies(): SWRResponse<Company[]> {
  const { data: user } = useUser();

  return useSWR<Company[]>('/companies', () => user?.companies || [], { fallbackData: [] });
}

/**
 * Hook to fetch and manage specific company data
 * @param id - Optional company ID to fetch
 * @returns SWR response containing company data or null
 */
export function useCompany(id?: string): SWRResponse<Company | null> {
  const { data: companies } = useCompanies();

  return useSWR<Company | null>(
    ['/company', id],
    (): Company | null => {
      if (id) {
        return companies?.find((c) => c.id === id) || null;
      } else {
        const agentName = getCookie('agixt-agent');
        return companies?.find((c) => (agentName ? c.agents.some((a) => a.name === agentName) : c.primary)) || null;
      }
    },
    { fallbackData: null },
  );
}
/**
 * Hook to fetch and manage all agents across companies
 * @returns SWR response containing array of agents
 */
export function useAgents(): SWRResponse<Agent[]> {
  const { data: companies } = useCompanies();

  return useSWR<Agent[]>(
    '/agents',
    (): Agent[] =>
      companies?.flatMap((company) =>
        company.agents.map((agent) => ({
          ...agent,
          companyName: company.name,
        })),
      ) || [],
    { fallbackData: [] },
  );
}
/**
 * Hook to fetch and manage agent data and commands
 * @param name - Optional agent name to fetch
 * @returns SWR response containing agent data and commands
 */
export function useAgent(name?: string): SWRResponse<{
  agent: Agent | null;
  commands: string[];
}> {
  const { data: companies } = useCompanies();
  const state = useContext(InteractiveConfigContext);
  let searchName = name || (getCookie('agixt-agent') as string | undefined);
  let foundEarly = null;
  if (!searchName && companies?.length) {
    const primaryCompany = companies.find((c) => c.primary);
    if (primaryCompany?.agents?.length) {
      const primaryAgent = primaryCompany?.agents.find((a) => a.default);
      foundEarly = primaryAgent ? primaryAgent : primaryCompany?.agents[0]; // Figure out why zod throws a fit when you try to parse this.
      searchName = foundEarly?.name;
      setCookie('agixt-agent', searchName, {
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      });
    }
  }
  return useSWR<{ agent: Agent | null; commands: string[] }>(
    [`/agent?name=${searchName}`],
    async (): Promise<{ agent: Agent | null; commands: string[] }> => {
      const toReturn = { agent: foundEarly, commands: [] };
      if (companies?.length && !toReturn.agent) {
        for (const company of companies) {
          const agent = company.agents.find((a) => a.name === searchName);
          if (agent) {
            toReturn.agent = agent; // Figure out why zod throws a fit when you try to parse this.
          }
        }
      }
      if (toReturn.agent) toReturn.commands = await state.agixt.getCommands(toReturn.agent.name);
      return toReturn;
    },
    { fallbackData: { agent: null, commands: [] } },
  );
}
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
      const query = ChainSchema.toGQL('query', 'GetChain');
      const response = await client.request<Chain>(query, { chainName });
      const validated = ChainResponseSchema.parse(response);
      return validated.data.chain;
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
      const query = ChainSchema.toGQL('query', 'GetChains');
      const response = await client.request<Chain[]>(query);
      const validated = ChainsResponseSchema.parse(response);
      return validated.data.chains;
    },
    { fallbackData: [] },
  );
}

/**
 * Hook to fetch and manage conversation data with real-time updates
 * @param conversationId - Conversation ID to fetch
 * @returns SWR response containing conversation data
 */
export function useConversation(conversationId: string): SWRResponse<Conversation | null> {
  const client = createGraphQLClient();

  return useSWR<Conversation | null>(
    conversationId ? [`/conversation`, conversationId] : null,
    async (): Promise<Conversation | null> => {
      const query = ConversationSchema.toGQL('subscription', 'WatchConversation');
      const response = await client.request<Conversation>(query, { conversationId });
      return response;
    },
    {
      fallbackData: null,
      refreshInterval: 1000, // Real-time updates
    },
  );
}

/**
 * Hook to fetch and manage all conversations with real-time updates
 * @returns SWR response containing array of conversation edges
 */
export function useConversations(): SWRResponse<ConversationEdge[]> {
  const client = createGraphQLClient();

  return useSWR<ConversationEdge[]>(
    '/conversations',
    async (): Promise<ConversationEdge[]> => {
      const query = ConversationsResponseSchema.toGQL('subscription', 'WatchConversations');
      const response = await client.request<ConversationEdge[]>(query);
      const validated = ConversationsResponseSchema.parse(response);
      return validated.data.conversations.edges;
    },
    {
      fallbackData: [],
      refreshInterval: 1000, // Real-time updates
    },
  );
}

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
      const query = CommandArgsResponseSchema.toGQL('query', 'GetCommandArgs');
      const response = await client.request<CommandArgs>(query, { commandName });
      const validated = CommandArgsResponseSchema.parse(response);
      return validated;
    },
    { fallbackData: null },
  );
}

/**
 * Hook to fetch and manage prompt categories
 * @returns SWR response containing array of prompt categories
 */
export function usePromptCategories(): SWRResponse<string[]> {
  const client = createGraphQLClient();

  return useSWR<string[]>(
    '/prompts/categories',
    async (): Promise<string[]> => {
      const query = PromptCategoriesResponseSchema.toGQL('query', 'GetPromptCategories');
      const response = await client.request(query);
      const validated = PromptCategoriesResponseSchema.parse(response);
      return validated.data.promptCategories;
    },
    { fallbackData: [] },
  );
}

/**
 * Hook to fetch and manage prompt data
 * @param category - Prompt category
 * @param name - Optional prompt name
 * @returns SWR response containing prompt data
 */
export function usePrompt(category: string, name?: string): SWRResponse<Prompt | null> {
  const client = createGraphQLClient();

  return useSWR<Prompt | null>(
    category && name ? [`/prompt`, category, name] : null,
    async (): Promise<Prompt | null> => {
      const query = PromptSchema.toGQL('query', 'GetPrompt');
      const response = await client.request<Prompt>(query, { category, name });
      const validated = PromptResponseSchema.parse(response);
      return validated.data.prompt;
    },
    { fallbackData: null },
  );
}
/**
 * Hook to fetch and manage all prompts for a category
 * @param category - Prompt category to fetch prompts for
 * @returns SWR response containing array of prompts
 */
export function usePrompts(category: string): SWRResponse<Prompt[]> {
  const client = createGraphQLClient();

  return useSWR<Prompt[]>(
    `/prompts?category=${category}`,
    async (): Promise<Prompt[]> => {
      const query = PromptSchema.toGQL('query', 'GetPrompts');
      const response = await client.request<Prompt[]>(query, { category });
      const validated = PromptsResponseSchema.parse(response);
      return validated.data.prompts;
    },
    { fallbackData: [] },
  );
}
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
      const query = ProviderSchema.toGQL('query', 'GetProvider');
      const response = await client.request<Provider>(query, { providerName });
      const validated = ProviderResponseSchema.parse(response);
      return validated.data.provider;
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
      const query = ProviderSchema.toGQL('query', 'GetProviders');
      const response = await client.request<Provider[]>(query);
      const validated = ProvidersResponseSchema.parse(response);
      return validated.data.providers;
    },
    { fallbackData: [] },
  );
}

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
      const query = InvitationSchema.toGQL('query', 'GetInvitations');
      const response = await client.request<Invitation[]>(query, { companyId });
      const validated = InvitationsResponseSchema.parse(response);
      return validated.data.invitations;
    },
    { fallbackData: [] },
  );
}

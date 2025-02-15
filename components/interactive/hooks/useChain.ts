import useSWR, { SWRResponse } from 'swr';
import { z } from 'zod';
import log from '../../jrg/next-log/log';
import { createGraphQLClient } from './lib';

export const ChainStepPromptSchema = z.object({
  chainName: z.string().nullable(),
  commandName: z.string().nullable(),
  promptCategory: z.unknown(),
  promptName: z.string().nullable(),
});

export const ChainStepSchema = z.object({
  agentName: z.string().min(1),
  prompt: ChainStepPromptSchema,
  promptType: z.string().min(1),
  step: z.number().int().nonnegative(),
});

export const ChainSchema = z.object({
  id: z.string().uuid(),
  chainName: z.string(), //.min(1),
  steps: z.array(ChainStepSchema),
});
export const ChainsSchema = ChainSchema.pick({ id: true, chainName: true });

export type Chain = z.infer<typeof ChainSchema>;
export type ChainStepPrompt = z.infer<typeof ChainStepPromptSchema>;
export type ChainStep = z.infer<typeof ChainStepSchema>;

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

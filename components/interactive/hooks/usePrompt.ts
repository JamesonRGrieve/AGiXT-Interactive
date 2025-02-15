import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import useSWR, { SWRResponse } from 'swr';
import { z } from 'zod';
import log from '../../jrg/next-log/log';
import { useInteractiveConfig } from '../InteractiveConfigContext';
import { createGraphQLClient } from './lib';

export const PromptArgumentSchema = z.object({
  name: z.string(),
});

export const PromptSchema = z.object({
  name: z.string(),
  category: z.string(),
  content: z.string(),
  description: z.string().optional(),
  arguments: z.array(PromptArgumentSchema),
});

export type Prompt = z.infer<typeof PromptSchema>;
export type PromptArgument = z.infer<typeof PromptArgumentSchema>;

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

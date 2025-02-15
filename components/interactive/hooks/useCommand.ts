import useSWR, { SWRResponse } from 'swr';
import { z } from 'zod';
import log from '../../jrg/next-log/log';
import { createGraphQLClient } from './lib';

export const CommandArgValueSchema = z.object({
  value: z.string(),
});

export const CommandArgSchema = z.object({
  name: z.string().min(1),
  value: CommandArgValueSchema,
});

export type CommandArgs = z.infer<typeof CommandArgSchema>;
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
        return CommandArgSchema.parse(response);
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

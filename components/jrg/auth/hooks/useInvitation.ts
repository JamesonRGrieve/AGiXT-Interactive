import { createGraphQLClient } from '@/components/interactive/hooks';
import useSWR, { SWRResponse } from 'swr';
import log from '../../next-log/log';
import { Invitation, InvitationSchema } from '../types/types';
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

import { chainMutations } from '@/components/interactive/hooks/lib';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import useSWR, { SWRResponse } from 'swr';
import log from '../../next-log/log';
import { Company } from '../types/types';
import { useUser } from './useUser';
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

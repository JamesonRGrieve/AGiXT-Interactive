'use client';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { ReactNode, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { useAuthentication } from '../Router';
import { Profile } from './Profile';
import { DynamicFormFieldValueTypes } from '@/components/jrg/dynamic-form/DynamicForm';
import { validateURI } from '@/lib/validation';
import { useAssertion } from '@/components/jrg/assert/assert';
import { Button } from '@/components/ui/button';

export type ManageProps = {
  userDataSWRKey?: string;
  userDataEndpoint?: string;
  userUpdateEndpoint?: string;
  userPasswordChangeEndpoint?: string;
};
const MENU_ITEMS: ActivePage[] = ['Profile', 'Team', 'Connected Services']; // TODO get account into here in basic mode

type ActivePage = 'Profile' | 'Team' | 'Account' | 'Connected Services'; //  | 'Appearance' | 'Notifications' |

export default function Manage({
  userDataSWRKey = '/user',
  userDataEndpoint = '/v1/user',
  userUpdateEndpoint = '/v1/user',
  userPasswordChangeEndpoint = '/v1/user/password',
}: ManageProps): ReactNode {
  const [responseMessage, setResponseMessage] = useState('');
  const [active, setActive] = useState<ActivePage>('Profile');
  log(['Menu Items', MENU_ITEMS], { client: 3 });
  type User = {
    missing_requirements?: {
      [key: string]: {
        type: 'number' | 'boolean' | 'text' | 'password';
        value: DynamicFormFieldValueTypes;
        validation?: (value: DynamicFormFieldValueTypes) => boolean;
      };
    };
  };
  const router = useRouter();
  const authConfig = useAuthentication();
  useAssertion(validateURI(authConfig.authServer + userDataEndpoint), 'Invalid identify endpoint.', [
    authConfig.authServer,
    userDataEndpoint,
  ]);
  useAssertion(validateURI(authConfig.authServer + userUpdateEndpoint), 'Invalid identify endpoint.', [
    authConfig.authServer,
    userUpdateEndpoint,
  ]);
  const { data, error, isLoading } = useSWR<User, any, string>(userDataSWRKey, async () => {
    return (
      await axios.get(`${authConfig.authServer}${userDataEndpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getCookie('jwt'),
        },
        validateStatus: (status) => [200, 403].includes(status),
      })
    ).data;
  });

  return (
    <div className='w-full'>
      <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-transparent p-4 md:gap-8 md:p-10'>
        <div className='flex justify-between w-full max-w-6xl gap-2 mx-auto'>
          {authConfig.manage.heading && <h2 className='text-3xl font-semibold'>{authConfig.manage.heading}</h2>}
          <Button
            key='done'
            onClick={() => {
              router.push('/chat');
            }}
          >
            Go to {authConfig.appName}
          </Button>
        </div>
        <Profile
          {...{
            isLoading,
            error,
            data,
            router,
            authConfig,
            userDataSWRKey,
            responseMessage,
            userUpdateEndpoint,
            setResponseMessage,
          }}
        />
        {/* <div className='mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
          <Nav {...{ active, setActive }} />
          <div className=''>
            {active === 'Profile' && (
              <Profile
                {...{
                  isLoading,
                  error,
                  data,
                  router,
                  authConfig,
                  userDataSWRKey,
                  responseMessage,
                  userUpdateEndpoint,
                  setResponseMessage,
                }}
              />
            )}
            {active === 'Account' && <Account {...{ authConfig, data, userPasswordChangeEndpoint, setResponseMessage }} />}
            {/* {active === 'Appearance' && <Appearance />}
            {active === 'Notifications' && <Notifications />} */}
        {/* {active === 'Team' && <Companies {...{ authConfig, data, setResponseMessage }} />}
            {active === 'Connected Services' && <ConnectedServices authConfig={authConfig} />}
          </div> 
        </div> */}
      </main>
    </div>
  );
}

// const Nav = ({ active, setActive }: { active: ActivePage; setActive: (page: ActivePage) => void }) => {
//   const { data } = useCompany();
//   console.log('DATA', data);
//   return (
//     <nav className='flex flex-col space-y-1'>
//       {MENU_ITEMS.map((label) => (
//         <Button
//           key={label}
//           variant='ghost'
//           className={cn('justify-start', active === label ? 'bg-muted' : '')}
//           disabled={label === 'Notifications'}
//           onClick={() => setActive(label)}
//         >
//           {label === 'Team' ? data?.name || 'Team' : label}
//         </Button>
//       ))}
//     </nav>
//   );
// };

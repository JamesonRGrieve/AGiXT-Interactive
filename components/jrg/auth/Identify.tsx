'use client';

import axios, { AxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { setCookie } from 'cookies-next';
import { LuUser } from 'react-icons/lu';
import OAuth from './oauth2/OAuth';
import { useAuthentication } from './Router';
import AuthCard from './AuthCard';
import { useAssertion } from '@/components/jrg/assert/assert';
import { validateURI } from '@/lib/validation';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';

const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid E-Mail address.' }),
  redirectTo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export type IdentifyProps = {
  identifyEndpoint?: string;
  redirectToOnExists?: string;
  redirectToOnNotExists?: string;
  oAuthOverrides?: any;
};

export default function Identify({
  identifyEndpoint = '/v1/user/exists',
  redirectToOnExists = '/login',
  redirectToOnNotExists = '/register', // TODO Default this to /register if in basic mode, and /login in magical mode
  oAuthOverrides = {},
}): ReactNode {
  const router = useRouter();
  const authConfig = useAuthentication();
  const pathname = usePathname();
  // console.log('TEST');
  // if (redirectToOnNotExists === '/register' && authConfig.authModes.magical) {
  //   redirectToOnNotExists = '/login';
  // }
  useAssertion(validateURI(authConfig.authServer + identifyEndpoint), 'Invalid identify endpoint.', [
    authConfig.authServer,
    identifyEndpoint,
  ]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const existsResponse = await axios.get(`${authConfig.authServer}${identifyEndpoint}?email=${formData.email}`);
      setCookie('email', formData.email, { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN });
      router.push(`${pathname}${existsResponse.data ? redirectToOnExists : redirectToOnNotExists}`);
    } catch (exception) {
      const axiosError = exception as AxiosError;
      setError('email', { type: 'server', message: axiosError.message });
    }
  };

  const showEmail = authConfig.authModes.basic || authConfig.authModes.magical;
  const showOAuth = authConfig.authModes.oauth2;

  return (
    <AuthCard title='Welcome' description='Please choose an authentication method.'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        {/* <div className='text-center'>
          {authConfig.identify.heading && <h2 className='text-3xl font-bold'>{authConfig.identify.heading}</h2>}
          {showEmail && showOAuth && (
            <p className='my-2 text-balance text-muted-foreground'>Please choose from one of the following</p>
          )}
        </div> */}

        {showEmail && (
          <>
            <Label htmlFor='E-Mail Address'>E-Mail Address</Label>
            <Input id='email' autoComplete='username' placeholder='your@example.com' {...register('email')} />
            {errors.email?.message && <Alert variant='destructive'>{errors.email?.message}</Alert>}

            <Button variant='default' disabled={isSubmitting} className='w-full space-x-1'>
              <LuUser className='w-5 h-5' />
              <span>Continue with Email</span>
            </Button>
          </>
        )}

        {showEmail && showOAuth ? (
          <div className='flex items-center gap-2 my-2'>
            <Separator className='flex-1' />
            <span>or</span>
            <Separator className='flex-1' />
          </div>
        ) : null}

        {showOAuth && <OAuth overrides={oAuthOverrides} />}
      </form>
    </AuthCard>
  );
}

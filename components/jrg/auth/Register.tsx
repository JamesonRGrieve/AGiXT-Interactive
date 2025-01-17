'use client';
import axios, { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { FormEvent, ReactNode, useEffect, useState, useRef } from 'react';
import { useAuthentication } from './Router';
import { toTitleCase } from '@/components/jrg/DynamicForm';
import PasswordField from '@/components/jrg/styled/Input/PasswordField';
import { ReCAPTCHA } from 'react-google-recaptcha';
import assert, { useAssertion } from '@/lib/assert';
import { validateURI } from '@/lib/validation';
import AuthCard from './AuthCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { get } from 'http';

export type RegisterProps = {
  additionalFields?: string[];
  userRegisterEndpoint?: string;
};

export default function Register({ additionalFields = [], userRegisterEndpoint = '/v1/user' }: RegisterProps): ReactNode {
  const formRef = useRef(null);
  const router = useRouter();
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const authConfig = useAuthentication();
  useAssertion(validateURI(authConfig.authServer + userRegisterEndpoint), 'Invalid login endpoint.', [
    authConfig.authServer,
    userRegisterEndpoint,
  ]);
  const submitForm = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (authConfig.recaptchaSiteKey && !captcha) {
      setResponseMessage('Please complete the reCAPTCHA.');
      return;
    }
    const formData = Object.fromEntries(new FormData((event.currentTarget as HTMLFormElement) ?? undefined));
    if (authConfig.authModes.basic) {
      if (!formData['password']) setResponseMessage('Please enter a password.');
      if (!formData['password-again']) setResponseMessage('Please enter your password again.');
      if (formData['password'] !== formData['password-again']) setResponseMessage('Passwords do not match.');
    }
    if (getCookie('invitation')) {
      formData['invitation_id'] = getCookie('invitation') ?? ''.toString();
    }
    let registerResponse;
    let registerResponseData;
    try {
      // TODO fix the stupid double submission.
      registerResponse = await axios
        .post(`${authConfig.authServer}${userRegisterEndpoint}`, {
          ...formData,
        })
        .catch((exception: AxiosError) => exception.response);
      registerResponseData = registerResponse?.data;
    } catch (exception) {
      console.error(exception);
      registerResponse = null;
    }

    // TODO Check for status 418 which is app disabled by admin.
    setResponseMessage(registerResponseData?.detail);
    const loginParams = [];
    if (registerResponseData?.otp_uri) {
      loginParams.push(`otp_uri=${registerResponseData?.otp_uri}`);
    }
    if (registerResponseData?.verify_email) {
      loginParams.push(`verify_email=true`);
    }
    if (registerResponseData?.verify_sms) {
      loginParams.push(`verify_sms=true`);
    }
    if ([200, 201].includes(registerResponse?.status || 500)) {
      router.push(loginParams.length > 0 ? `/user/login?${loginParams.join('&')}` : '/user/login');
    }
  };
  useEffect(() => {
    // To-Do Assert that there are no dupes or empty strings in additionalFields (after trimming and lowercasing)
  }, [additionalFields]);
  useEffect(() => {
    if (getCookie('invitation')) {
      setInvite(getCookie('company') || '');
    }
  }, []);
  useEffect(() => {
    if (!submitted && formRef.current && authConfig.authModes.magical && additionalFields.length === 0) {
      setSubmitted(true);
      formRef.current.requestSubmit();
    }
  }, []);
  const [invite, setInvite] = useState<string | null>(null);
  return (
    <div className={additionalFields.length === 0 && authConfig.authModes.magical ? ' invisible' : ''}>
      <AuthCard
        title={invite !== null ? 'Accept Invitation to ' + (invite || 'Company') : 'Sign Up'}
        description={`Welcome, please complete your registration. ${invite !== null ? 'You are accepting an invitation' : ''}${invite ? ' to ' + invite + '.' : ''}${invite !== null ? '.' : ''}`}
        showBackButton
      >
        <form onSubmit={submitForm} className='flex flex-col gap-4' ref={formRef}>
          {/* {authConfig.register.heading && <Typography variant='h2'>{authConfig.register.heading}</Typography>} */}

          <input type='hidden' id='email' name='email' value={getCookie('email')} />
          {authConfig.authModes.basic && (
            <>
              <PasswordField />
              <PasswordField id='password-again' name='password-again' label='Password (Again)' />
            </>
          )}
          {additionalFields.length > 0 &&
            additionalFields.map((field) => (
              <div key={field} className='space-y-1'>
                <Label htmlFor={field}>{toTitleCase(field)}</Label>
                <Input key={field} id={field} name={field} type='text' required placeholder={toTitleCase(field)} />
              </div>
            ))}
          {authConfig.recaptchaSiteKey && (
            <div
              style={{
                margin: '0.8rem 0',
              }}
            >
              <ReCAPTCHA
                sitekey={authConfig.recaptchaSiteKey}
                onChange={(token: string | null) => {
                  setCaptcha(token);
                }}
              />
            </div>
          )}
          <Button type='submit'>Register</Button>
          {responseMessage && <AuthCard.ResponseMessage>{responseMessage}</AuthCard.ResponseMessage>}
        </form>
      </AuthCard>
    </div>
  );
}

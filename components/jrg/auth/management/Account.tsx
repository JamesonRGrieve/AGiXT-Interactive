'use client';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { FormEvent } from 'react';
import PasswordField from '@/components/jrg/styled/Input/PasswordField';
import { Separator } from '@/components/ui/separator';

export const Account = ({
  authConfig,
  data,
  userPasswordChangeEndpoint = '/v1/user/password',
  setResponseMessage,
}: {
  authConfig: any;
  data: any;
  userPasswordChangeEndpoint?: string;
  setResponseMessage: (message: string) => void;
}) => {
  return (
    <div>
      <div>
        <h3 className='text-lg font-medium'>Account</h3>
        <p className='text-sm text-muted-foreground'>Update your account information</p>
      </div>
      <Separator className='my-4' />
      {authConfig.authModes.basic && (
        <form
          onSubmit={async (event: FormEvent<HTMLFormElement>): Promise<void> => {
            const formData = Object.fromEntries(new FormData((event.currentTarget as HTMLFormElement) ?? undefined));

            if (!formData['password']) setResponseMessage('Please enter a password.');
            if (!formData['password-again']) setResponseMessage('Please enter your password again.');
            if (formData['password'] !== formData['password-again']) setResponseMessage('Passwords do not match.');
            const passwordResetResponse = await axios
              .put(
                `${authConfig.authServer}${userPasswordChangeEndpoint}`,
                {
                  ...data,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: getCookie('jwt'),
                  },
                },
              )
              .catch((exception: any) => exception.response);
            if (passwordResetResponse.data.detail) {
              setResponseMessage(passwordResetResponse.data.detail.toString());
            }
            if (passwordResetResponse.status === 200) {
              window.location.reload();
            }
          }}
        >
          <PasswordField id='old-password' name='old-password' label='Your Old Password' />
          <PasswordField id='new-password' name='new-password' label='Your New Password' />
          <PasswordField id='new-password-again' name='new-password-again' label='Your New Password (Again)' />
        </form>
      )}
      {
        // TODO MFA management / backup codes.
        // TODO Quota management for user mode.
      }
    </div>
  );
};

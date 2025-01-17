'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { getCookie } from 'cookies-next';
import { LuCheckCircle, LuKey } from 'react-icons/lu';
import Field from '@/components/jrg/styled/FormControl/Field';
import log from '@/lib/log';
import { Button } from '@/components/ui/button';

export type RegisterFormProps = object;
export default function VerifyEmail({ verifiedCallback }: { verifiedCallback: any }): JSX.Element {
  const [fields, setFields] = useState({
    emailCode: '',
  });
  const [errors, setErrors] = useState({
    emailCode: '',
  });
  const [emailVerified, setEmailVerified] = useState(false);
  async function attemptEmail() {
    const emailResponse = (
      await axios.post(
        `/api/email`,
        {
          email: getCookie('email'),
          mfa_token: fields.emailCode,
        },
        {},
      )
    ).data.detail;
    //console.log(emailResponse);
    if (emailResponse.toLowerCase() === 'true') {
      verifiedCallback(true);
      setEmailVerified(true);
    } else {
      log(`Email verification of ${getCookie('email')} failed.`, process.env.NEXT_PUBLIC_LOG_VERBOSITY_CLIENT, 2);
      setErrors({
        ...errors,
        emailCode: 'Email verification failed.',
      });
    }
  }

  return (
    <>
      <div>
        <h5 className='py-4 text-2xl text-center'>Email Verification</h5>
        {!emailVerified && (
          <div className='py-2'>An email with a code was sent to {getCookie('email')}. Please enter the code below.</div>
        )}
      </div>
      <div className='flex flex-col items-center'>
        {emailVerified ? (
          <LuCheckCircle className='w-20 h-20' />
        ) : (
          <>
            <Field
              nameID='email-code-input'
              label='EMail Code'
              //autoComplete='email-code'
              value={fields.emailCode}
              onChange={(e: any) => setFields({ ...fields, emailCode: e.target.value })}
              //submit={null}
              //error={errors.emailCode}
            />
            <Button variant='outline' className='space-x-1 bg-transparent' onClick={attemptEmail}>
              <LuKey className='w-5 h-5' />
              <span>Verify Email</span>
            </Button>
          </>
        )}
      </div>
    </>
  );
}

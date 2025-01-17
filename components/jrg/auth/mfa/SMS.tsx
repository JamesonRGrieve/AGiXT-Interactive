'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { getCookie } from 'cookies-next';
import log from '@/lib/log';

export type RegisterFormProps = object;
export default function VerifySMS({ verifiedCallback }: { verifiedCallback: any }): JSX.Element {
  const [fields, setFields] = useState({
    smsCode: '',
  });
  const [errors, setErrors] = useState({
    smsCode: '',
  });
  const [smsVerified, setSMSVerified] = useState(false);
  async function attemptSMS(): Promise<void> {
    const smsResponse = (
      await axios.post(
        `/api/email`,
        {
          email: getCookie('email'),
          mfa_token: fields.smsCode,
        },
        {},
      )
    ).data.detail;
    //console.log(smsResponse);
    if (smsResponse.toLowerCase() === 'true') {
      verifiedCallback(true);
      setSMSVerified(true);
    } else {
      log(`Email verification of ${getCookie('email')} failed.`, process.env.NEXT_PUBLIC_LOG_VERBOSITY_CLIENT, 2);
      setErrors({
        ...errors,
        smsCode: 'SMS verification failed.',
      });
    }
  }

  return (
    <>
      <div>
        <h5 className='py-4 text-2xl text-center'>SMS Verification</h5>
        {!smsVerified && <p className='py-2'>This verification method is currently unavailable.</p>}
      </div>
      {/*
      <Box display='flex' flexDirection='column' alignItems='center'>
        {smsVerified ? (
             <CheckCircle sx={{fontSize: "5rem"}} />
        ) : (
          <>
            <TextFieldWithAlert
              id='email-code-input'
              label='EMail Code'
              autoComplete='email-code'
              value={fields.smsCode}
              onChange={(e: any) => setFields({ ...fields, smsCode: e.target.value })}
              submit={null}
              error={errors.smsCode}
            />
            <ButtonWithIcon label='Verify Email' icon={<VpnKey fontSize='large' />} action={attemptEmail} />
          </>
        )}
      </Box>
        */}
    </>
  );
}

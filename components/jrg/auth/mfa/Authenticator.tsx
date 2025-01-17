'use client';

import axios from 'axios';
import { LuCheckCircle, LuKey } from 'react-icons/lu';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { deleteCookie, getCookie } from 'cookies-next';
import Field from '@/components/jrg/styled/FormControl/Field';
import log from '@/lib/log';
import { Button } from '@/components/ui/button';
import { set } from 'react-hook-form';

export type RegisterFormProps = object;
export default function VerifyAuthenticator({ verifiedCallback }: { verifiedCallback: any }): JSX.Element {
  const [fields, setFields] = useState({
    token: '',
  });
  const [platformLink, setPlatformLink] = useState('');
  const [errors, setErrors] = useState({
    token: '',
  });
  const [totpVerified, setTotpVerified] = useState(false);
  const totpUri = getCookie('totpUri');

  useEffect(() => {
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
      setPlatformLink('https://apps.apple.com/us/app/google-authenticator/id388497605');
    }
    if (navigator.userAgent.match(/android/i)) {
      setPlatformLink('https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2');
    }
  }, []);
  async function attemptTotp(): Promise<void> {
    try {
      const response = await axios.post(`/api/mfa`, {
        email: getCookie('email'),
        mfa_token: fields.token,
      });
      const totpResponse = response.data.detail;
      // console.log(totpResponse);
      if (totpResponse.toLowerCase() === 'true') {
        verifiedCallback(true);
        setTotpVerified(true);
        deleteCookie('totpUri');
      } else {
        log(`TOTP verification of ${getCookie('email')} failed.`, process.env.NEXT_PUBLIC_LOG_VERBOSITY_CLIENT, 2);
        setErrors({
          ...errors,
          token: 'TOTP verification failed.',
        });
      }
    } catch (error) {
      console.error('Error verifying TOTP:', error);
      setErrors({
        ...errors,
        token: 'Error during TOTP verification.',
      });
    }
  }

  return (
    <>
      <div>
        <h5 className='py-2 text-center'>Authenticator App Verification</h5>
        {!totpVerified && (
          <>
            <p className='py-2'>
              Please add the following QR code to your authenticator app of choice and enter the code below. If you
              don&quot;t have one, we recommend{' '}
              {platformLink ? <a href={platformLink}>Google Authenticator</a> : 'Google Authenticator'}.
            </p>
            <div className='w-full h-auto mx-auto my-0 max-w-64'>
              <QRCode
                size={256}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                value={totpUri ?? ''}
                viewBox={`0 0 256 256`}
              />
            </div>
          </>
        )}
      </div>
      <div className='flex flex-col items-center'>
        {totpVerified ? (
          <LuCheckCircle className='w-20 h-20' />
        ) : (
          <>
            <Field
              nameID='totp-input'
              label='MFA Code'
              //autoComplete='one-time-code'
              value={fields.token}
              onChange={(e: any) => setFields({ ...fields, token: e.target.value })}
              //submit={null}
              //error={errors.token}
            />
            <Button variant='outline' className='space-x-1 bg-transparent' onClick={attemptTotp}>
              <LuKey className='w-5 h-5' />
              <span>Verify MFA</span>
            </Button>
          </>
        )}
      </div>
    </>
  );
}

'use client';

import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { Suspense } from 'react';
import { useAuthentication } from './Router';
import PricingTable from './stripe/PricingTable';

export type SubscribeProps = { redirectTo?: string };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export default function Subscribe({ searchParams }: { searchParams: any }): JSX.Element {
  const router = useRouter();
  const authConfig = useAuthentication();

  if (process.env.NEXT_PUBLIC_STRIPE_ENABLED === 'true') {
    router.push('/');
  }
  return (
    <>
      {authConfig.subscribe.heading && <h2 className='text-3xl'>{authConfig.subscribe.heading}</h2>}
      {process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID ? (
        <Suspense fallback={<p>Loading pricing...</p>}>
          <h1>Subscribe</h1>
          <div id='stripe-box'>
            <script async src='https://js.stripe.com/v3/pricing-table.js' />
            <stripe-pricing-table
              pricing-table-id={process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID ?? ''}
              publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''}
              customer-session-client-secret={searchParams?.customer_session}
              customer-email={searchParams?.customer_session ? undefined : searchParams?.email || getCookie('email')}
            />
          </div>
        </Suspense>
      ) : (
        <PricingTable />
      )}
    </>
  );
}

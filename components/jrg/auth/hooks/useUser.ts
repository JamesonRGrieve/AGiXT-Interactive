'use client';
import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

// Create a custom SWR hook for a specific endpoint
export default function useUser() {
  const router = useRouter();
  return useSWR(
    '/user',
    async () => {
      const userDataReq = await axios.get(`${process.env.NEXT_PUBLIC_AGIXT_SERVER}/v1/user`, {
        headers: {
          Authorization: getCookie('jwt'),
        },
      });
      if (!getCookie('agixt-company-id')) {
        console.log('Setting company ID to: ' + userDataReq.data.companies.filter((x) => x.primary)[0].id);
        setCookie('agixt-company-id', userDataReq.data.companies.filter((x) => x.primary)[0].id, {
          domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
        });
      }
      if (userDataReq.status === 402) {
        router.push('/user/subscribe');
      }
      return userDataReq.data;
    },
    {
      fallbackData: {},
    },
  );
}

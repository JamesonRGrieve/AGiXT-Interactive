import { NextResponse, NextRequest } from 'next/server';
import { useNextAPIBypass, useJWTQueryParam, useGoogleOAuth2, useAuth } from 'jrgcomponents/Middleware/Hooks';
import { getQueryParams } from 'jrgcomponents/Middleware';

export default async function Middleware(req: NextRequest): Promise<NextResponse> {
  const hooks = [useNextAPIBypass, useJWTQueryParam, useAuth];
  const queryParams = getQueryParams(req);
  if (queryParams.code) {
    const request = JSON.stringify({
      code: queryParams.code,
      referrer: req.cookies.get('href')?.value ?? process.env.NEXT_PUBLIC_AUTH_WEB,
    });
    const auth = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVER}/v1/oauth2/google`, {
      method: 'POST',
      body: request,
    }).then(async (response) => {
      return {
        status: response.status,
        body: await response.text(),
      };
    });
    console.log(request);
    console.log(auth);
  }
  for (const hook of hooks) {
    const hookResult = await hook(req);
    if (hookResult.activated) {
      return hookResult.response;
    }
  }
  return NextResponse.next();
}

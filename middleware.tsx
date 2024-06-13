import { NextResponse, NextRequest } from 'next/server';
import { useNextAPIBypass, useJWTQueryParam, useGoogleOAuth2, useAuth } from 'jrgcomponents/Middleware/Hooks';

export default async function Middleware(req: NextRequest): Promise<NextResponse> {
  const hooks = [useNextAPIBypass, useGoogleOAuth2, useJWTQueryParam, useAuth];
  for (const hook of hooks) {
    const hookResult = await hook(req);
    if (hookResult.activated) {
      return hookResult.response;
    }
  }
  return NextResponse.next();
}

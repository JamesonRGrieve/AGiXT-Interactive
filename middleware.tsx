import { NextResponse, NextRequest } from 'next/server';
import { useNextAPIBypass, useJWTValidation } from 'jrgcomponents/Middleware/Hooks';
import { getRequestedURI, AuthMode, getAuthMode, getQueryParams, generateCookieString } from 'jrgcomponents/Middleware';
export default async function Middleware(req: NextRequest): Promise<NextResponse> {
  const nextAPIBypass = useNextAPIBypass(req);
  if (nextAPIBypass.activated) {
    return nextAPIBypass.response;
  }
  const authMode = getAuthMode();
  console.log('Authentication Mode:', authMode);
  const requestedURI = getRequestedURI(req);
  console.log('Requested URI:', requestedURI);
  const queryParams = getQueryParams(req);
  console.log('Query Parameters:', queryParams);

  const jwtValidation = useJWTValidation(req);
  if (jwtValidation.activated) {
    return jwtValidation.response;
  }

  const headers: HeadersInit = {};
  if (authMode) {
    const rawJWT = req.cookies.get('jwt')?.value;
    // Strip any and all 'Bearer 's off of JWT.
    const jwt = rawJWT?.split(' ')[rawJWT?.split(' ').length - 1] ?? rawJWT ?? '';
    console.log('JWT:', jwt);
    if (jwt) {
      try {
        const authEndpoint = `${process.env.AUTH_SERVER}/v1/user`;
        console.log(`Verifying JWT Bearer ${jwt} with AUTH_SERVER at ${authEndpoint}...`);
        const response = await fetch(authEndpoint, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${jwt}`,
          },
        });
        if (response.status !== 200) {
          throw new Error(`Invalid token response, status ${response.status}, detail ${(await response.json()).detail}.`);
        }
        console.log('JWT is valid.');
      } catch (exception) {
        console.error(`Invalid token. Logging out and redirecting to AUTH_WEB at ${process.env.AUTH_WEB}.`, exception);
        const response = NextResponse.redirect(new URL(process.env.AUTH_WEB), { headers });
        // @ts-expect-error NextJS' types are wrong.
        response.headers.set('Set-Cookie', [
          generateCookieString('jwt', '', (0).toString()),
          generateCookieString('href', requestedURI, (86400).toString()),
        ]);
        return response;
      }
    } else {
      console.log(
        `${requestedURI} does ${requestedURI.startsWith(process.env.AUTH_WEB) ? '' : 'not '}start with ${process.env.AUTH_WEB}.`,
      );
      if (authMode === AuthMode.MagicalAuth && requestedURI.startsWith(process.env.AUTH_WEB)) {
        // Don't let users visit Identify, Register or Login pages if they're already logged in.
        if (jwt.length > 0 && req.nextUrl.pathname !== '/user/manage') {
          return NextResponse.redirect(new URL(process.env.AUTH_WEB + '/manage'));
        } else {
          return NextResponse.next();
        }
      } else {
        return NextResponse.redirect(new URL(process.env.AUTH_WEB), {
          headers: { 'Set-Cookie': generateCookieString('href', requestedURI, (86400).toString()) },
        });
      }
    }
    return NextResponse.next();
  }
}

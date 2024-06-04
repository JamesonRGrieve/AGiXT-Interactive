import { NextResponse, NextRequest } from 'next/server';

const AuthMode = {
  None: 0,
  GTAuth: 1,
  MagicalAuth: 2,
};
const generateCookieString = (key: string, value: string, age: string): string =>
  `${key}=${value}; Domain=${process.env.NEXT_PUBLIC_COOKIE_DOMAIN}; Path=/; Max-Age=${age}; Same-Site: strict;`;
export default async function Middleware(req: NextRequest): Promise<NextResponse> {
  if (
    req.nextUrl.pathname.startsWith('/_next/') ||
    req.nextUrl.pathname.startsWith('/api/') ||
    req.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  let authMode = AuthMode.None;
  if (process.env.AUTH_WEB && process.env.AUTH_SERVER) {
    if (process.env.APP_URI && process.env.AUTH_WEB.startsWith(process.env.APP_URI)) {
      authMode = AuthMode.MagicalAuth;
      if (!process.env.AUTH_WEB.endsWith('/user')) {
        throw new Error('Invalid AUTH_WEB. For Magical Auth implementations, AUTH_WEB must point to APP_URI/user.');
      }
    } else {
      authMode = AuthMode.GTAuth;
    }
  }
  console.log('Authentication Mode:', authMode);
  console.log(req);
  const requestedURI = req.url.split('?')[0];
  console.log('Requested URI:', requestedURI);
  const headers: HeadersInit = {};
  // Middleware doesn't have a great method for pulling query parameters (yet).
  const queryParams = req.url.includes('?')
    ? Object.assign(
        {},
        ...req.url
          .split('?')[1]
          .split('&')
          .map((param) => ({ [param.split('=')[0]]: param.split('=')[1] })),
      )
    : {};
  console.log('Query Parameters:', queryParams);
  if (queryParams.token || queryParams.jwt) {
    // This should set the cookie and then re-run the middleware (without query params).
    return NextResponse.redirect(req.cookies.get('href')?.value ?? requestedURI, {
      headers: {
        // @ts-expect-error NextJS' types are wrong.
        'Set-Cookie': [
          generateCookieString('jwt', queryParams.token ?? queryParams.jwt, (86400 * 7).toString()),
          generateCookieString('href', '', (0).toString()),
        ],
      },
    });
  }
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

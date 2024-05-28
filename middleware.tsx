import { NextResponse, NextRequest } from 'next/server';
export default async function Middleware(req: NextRequest) {
  if (
    process.env.AUTH_WEB?.startsWith(process.env.APP_URI ?? 'App URI Not Found') &&
    !process.env.AUTH_WEB.endsWith('/user')
  ) {
    throw new Error('Invalid AUTH_WEB. For Magical Auth implementations, AUTH_WEB must point to /user.');
  }
  const headers: any = {};
  const queryParams = req.url.includes('?')
    ? Object.assign(
        {},
        ...req.url
          .split('?')[1]
          .split('&')
          .map((param) => ({ [param.split('=')[0]]: param.split('=')[1] })),
      )
    : {};
  console.log(queryParams);
  if (queryParams.token) {
    headers['Set-Cookie'] =
      `jwt=${queryParams.token}; Domain=${process.env.NEXT_PUBLIC_COOKIE_DOMAIN}; Path=/; SameSite=Strict;`;
    const urlWithoutParams = req.url.split('?')[0];
    return NextResponse.redirect(urlWithoutParams, { headers });
  }
  if (req.nextUrl.pathname.startsWith('/_next/') || req.nextUrl.pathname === '/favicon.ico') {
    return NextResponse.next();
  } else if (process.env.AUTH_WEB) {
    let jwt = req.cookies.get('jwt')?.value;
    if (jwt) {
      try {
        console.log('Sending', `${jwt.startsWith('Bearer ') ? jwt : 'Bearer ' + jwt} to ${process.env.AUTH_SERVER}/v1/user`);
        const response = await fetch(`${process.env.AUTH_SERVER}/v1/user`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: jwt,
          },
        });
        if (response.status !== 200) throw new Error('Invalid token response, status ' + response.status + '.');
      } catch (exception) {
        console.error('Invalid token. Logging out.', exception);
        headers['Set-Cookie'] = `jwt=; Domain=${process.env.NEXT_PUBLIC_COOKIE_DOMAIN}; Path=/; SameSite=Strict; Max-Age=0;`;
        jwt = '';
        return NextResponse.redirect(new URL(process.env.AUTH_WEB), { headers });
      }
    }
    if (req.nextUrl.href.startsWith(process.env.AUTH_WEB)) {
      if (jwt && req.nextUrl.pathname !== '/user/manage') {
        return NextResponse.redirect(new URL(process.env.AUTH_WEB + '/manage'));
      } else {
        return NextResponse.next();
      }
    } else {
      if (!jwt) {
        console.log(`${req.nextUrl.href} does not start with ${process.env.AUTH_WEB} and no valid JWT, redirecting...`);
        headers['Set-Cookie'] =
          `href=${req.nextUrl.href}; Domain=${process.env.NEXT_PUBLIC_COOKIE_DOMAIN}; Path=/; SameSite=Strict; Max-Age=0;`;
        console.log('href cookie set to: ', req.nextUrl.href);
        return NextResponse.redirect(new URL(process.env.AUTH_WEB), { headers });
      }
    }
  } else if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  } else if (req.nextUrl.pathname !== req.nextUrl.pathname.toLowerCase()) {
    return NextResponse.redirect(new URL(req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()));
  } else {
    return NextResponse.next();
  }
}

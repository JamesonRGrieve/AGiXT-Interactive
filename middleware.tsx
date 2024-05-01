import { NextResponse, NextRequest } from 'next/server';
const Middleware = async (req: NextRequest) => {
  let jwt = req.cookies.get('jwt')?.value;
  const headers: any = {};
  if (process.env.AUTH_WEB) {
    if (jwt) {
      try {
        console.log('Sending', `${jwt.startsWith('Bearer ') ? jwt : 'Bearer ' + jwt}`);
        const response = await fetch(`${process.env.AUTH_SERVER}/v1/user`, {
          headers: {
            Authorization: `${jwt.startsWith('Bearer ') ? jwt : 'Bearer ' + jwt}`,
          },
        });

        if (response.status !== 200) throw new Error('Invalid token response, status ' + response.status + '.');
      } catch (exception) {
        console.error('Invalid token. Logging out.', exception);
        headers['Set-Cookie'] =
          `jwt=; Domain=${process.env.NEXT_PUBLIC_COOKIE_DOMAIN}; Path=/; HttpOnly; SameSite=Strict; Max-Age=0;`;
        jwt = '';
        return NextResponse.redirect(new URL(process.env.AUTH_WEB), { headers });
      }
    } else {
      return NextResponse.redirect(new URL(process.env.AUTH_WEB));
    }
  } else if (req.nextUrl.pathname.startsWith('/api/') || req.nextUrl.pathname.startsWith('/_next/')) {
    return NextResponse.next();
  } else if (req.nextUrl.pathname !== req.nextUrl.pathname.toLowerCase()) {
    NextResponse.redirect(new URL(req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()));
  } else {
    return NextResponse.next();
  }
};
export default Middleware;

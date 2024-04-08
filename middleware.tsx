import { NextResponse, NextRequest } from 'next/server';
const Middleware = (req: NextRequest) => {
  console.log(process.env.NEXT_PUBLIC_APP_AUTHENTICATION_ENABLED === 'true');
  console.log(!req.cookies?.get('jwt'));
  if (process.env.NEXT_PUBLIC_APP_AUTHENTICATION_ENABLED === 'true' && !req.cookies?.get('jwt'))
    return NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_AUTH_WEB as string));
  else if (
    req.nextUrl.pathname.startsWith('/api/') ||
    req.nextUrl.pathname.startsWith('/_next/') ||
    req.nextUrl.pathname === req.nextUrl.pathname.toLowerCase()
  )
    return NextResponse.next();
  else if (req.nextUrl.pathname.includes('admin') && false /* TODO: check if user is admin */)
    return NextResponse.redirect(new URL(req.nextUrl.origin));
  else NextResponse.redirect(new URL(req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()));
};
export default Middleware;

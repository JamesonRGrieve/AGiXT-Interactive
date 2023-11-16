import { NextResponse, NextRequest } from 'next/server';
const Middleware = (req: NextRequest) =>
  req.nextUrl.pathname.startsWith('/api/') ||
  req.nextUrl.pathname.startsWith('/_next/') ||
  req.nextUrl.pathname === req.nextUrl.pathname.toLowerCase()
    ? NextResponse.next()
    : NextResponse.redirect(new URL(req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()));
export default Middleware;

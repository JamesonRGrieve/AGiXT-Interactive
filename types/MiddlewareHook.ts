import { NextRequest, NextResponse } from 'next/server';

export type MiddlewareHook = (req: NextRequest) => Promise<{
  activated: boolean;
  response: NextResponse;
}>;

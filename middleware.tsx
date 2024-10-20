import { NextResponse, NextRequest } from 'next/server';
import { useNextAPIBypass, useJWTQueryParam, useAuth } from 'jrgcomponents/Middleware/Hooks';

export default async function Middleware(req: NextRequest): Promise<NextResponse> {
	const hooks = [useNextAPIBypass, useJWTQueryParam, useAuth];
	for (const hook of hooks) {
		const hookResult = await hook(req);
		if (hookResult.activated) {
			return hookResult.response;
		}
	}
	return NextResponse.next();
}

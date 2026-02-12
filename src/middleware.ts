'use server';

// This file is intentionally left blank to resolve a Next.js build issue.
// It creates a minimal middleware that does nothing, satisfying the build system's
// requirement for a middleware manifest without affecting the application's behavior.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Return the request chain as-is.
  return NextResponse.next();
}

// This config ensures the middleware never actually runs on any real path.
export const config = {
  matcher: '/this-path-will-not-match-anything-intentionally',
};

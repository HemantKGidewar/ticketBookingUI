import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export function isAuthenticated(): boolean {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');
    return authCookie?.value === 'true';
  } catch (error) {
    return false;
  }
}

export function isAuthenticatedFromRequest(request: NextRequest): boolean {
  const authCookie = request.cookies.get('auth');
  return authCookie?.value === 'true';
}

export function setAuthCookie(): string {
  return 'auth=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400';
}

export function clearAuthCookie(): string {
  return 'auth=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}
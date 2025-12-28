import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string; // username
  exp: number; // expiration
  iat: number; // issued at
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Client-side auth check using document.cookie
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return document.cookie.includes('auth=true');
  } catch (error) {
    return false;
  }
}

export function setAuthCookie(): string {
  return 'auth=true; Path=/; SameSite=Lax; Max-Age=86400';
}

export function clearAuthCookie(): string {
  return 'auth=; Path=/; SameSite=Lax; Max-Age=0';
}

// JWT Token Management Functions
export function setJwtTokens(tokens: AuthTokens): void {
  // Store tokens in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  // Also set cookie for middleware compatibility
  document.cookie = 'auth=true; Path=/; SameSite=Lax; Max-Age=86400';
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
}

export function clearJwtTokens(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  document.cookie = 'auth=; Path=/; SameSite=Lax; Max-Age=0';
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

export function isJwtAuthenticated(): boolean {
  const token = getAccessToken();
  return token !== null && !isTokenExpired(token);
}

export function getUsernameFromToken(): string | null {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded.sub;
  } catch {
    return null;
  }
}

// Enhanced authentication check (JWT first, then demo fallback)
export function isFullyAuthenticated(): boolean {
  // Check JWT first
  if (isJwtAuthenticated()) {
    return true;
  }

  // Fallback to demo auth
  return isAuthenticated();
}

// Logout function - clears both JWT and demo auth
export function logout(): void {
  // Clear JWT tokens
  clearJwtTokens();

  // Clear demo auth cookie as well
  document.cookie = clearAuthCookie();

  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
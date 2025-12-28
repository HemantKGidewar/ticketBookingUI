const AUTH_API_BASE_URL = 'http://localhost:8081';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  token: string; // refresh token
}

export interface RefreshRequest {
  token: string; // refresh token
}

async function authApiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${AUTH_API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Auth API error: ${response.status}`);
  }

  return response.json();
}

export async function loginWithAuthService(credentials: LoginRequest): Promise<AuthResponse> {
  return authApiCall<AuthResponse>('/auth/v1/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function signupWithAuthService(userData: SignupRequest): Promise<AuthResponse> {
  return authApiCall<AuthResponse>('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function refreshToken(refreshRequest: RefreshRequest): Promise<AuthResponse> {
  return authApiCall<AuthResponse>('/auth/v1/refreshToken', {
    method: 'POST',
    body: JSON.stringify(refreshRequest),
  });
}
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { loginWithAuthService } from '../../lib/authApi';
import { setJwtTokens, setAuthCookie } from '../../lib/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/search';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Login attempt - redirectTo:', redirectTo);

    try {
      // Try JWT authentication first
      const authResponse = await loginWithAuthService({ username, password });

      // Set JWT tokens
      setJwtTokens({
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.token
      });

      console.log('JWT login successful, redirecting to:', redirectTo);
      // Force a full navigation to ensure middleware runs with new auth
      window.location.assign(redirectTo);
      return;

    } catch (error: any) {
      console.error('AuthService login failed:', error);

      // Check if this is demo credentials
      if (username === 'Hello' && password === 'World') {
        // Set demo auth cookie
        document.cookie = setAuthCookie();
        console.log('Demo login successful, redirecting to:', redirectTo);
        window.location.assign(redirectTo);
        return;
      }

      // Provide specific error messages based on the error
      if (error.message.includes('403')) {
        setError('Invalid username or password. Please check your credentials.');
      } else if (error.message.includes('404')) {
        setError('Authentication service is not available. Please try again later.');
      } else if (error.message.includes('500')) {
        setError('Server error occurred. Please try again later.');
      } else {
        setError('Login failed. Please check your credentials or try demo login (Hello/World).');
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600 text-center">
          <div className="border-t pt-4">
            <div className="mb-2">
              <a href="/signup" className="text-blue-600 hover:text-blue-800">
                Don&apos;t have an account? Sign up
              </a>
            </div>
            <div className="text-xs text-gray-500">
              Or try demo access: Username "Hello", Password "World"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
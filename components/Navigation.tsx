'use client';

import { useEffect, useState } from 'react';
import { isFullyAuthenticated, logout, getUsernameFromToken } from '../lib/auth';

export default function Navigation() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check auth status on client side
    setIsAuth(isFullyAuthenticated());
    setUsername(getUsernameFromToken());
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <a href="/" className="hover:text-blue-200 transition-colors">
            Train Booking System
          </a>
        </h1>
        <div className="flex space-x-4 items-center">
          <a href="/search" className="hover:text-blue-200 transition-colors">
            Search Trains
          </a>
          <a href="/bookings" className="hover:text-blue-200 transition-colors">
            My Bookings
          </a>

          {isAuth ? (
            <>
              {username && (
                <span className="text-blue-200">
                  Welcome, {username}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <a href="/login" className="bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded transition-colors">
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function HomeContent() {
  const searchParams = useSearchParams();
  const bookingSuccess = searchParams.get('booking') === 'success';
  return (
    <div className="max-w-md mx-auto mt-8">
      {bookingSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                Booking successful! Your ticket has been confirmed.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Welcome to Train Booking System
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Book your train tickets quickly and easily
        </p>

        <div className="space-y-3">
          <Link
            href="/search"
            className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Booking
          </Link>

          <Link
            href="/bookings"
            className="block w-full bg-gray-600 text-white text-center py-3 px-4 rounded-md hover:bg-gray-700 transition-colors"
          >
            View My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
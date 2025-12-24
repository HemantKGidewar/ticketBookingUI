import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Train Ticket Booking',
  description: 'Book train tickets online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">
          <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold">
                <a href="/" className="hover:text-blue-200 transition-colors">
                  Train Booking System
                </a>
              </h1>
              <div className="flex space-x-4">
                <a href="/search" className="hover:text-blue-200 transition-colors">
                  Search Trains
                </a>
                <a href="/bookings" className="hover:text-blue-200 transition-colors">
                  My Bookings
                </a>
              </div>
            </div>
          </nav>
          <div className="container mx-auto p-4">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
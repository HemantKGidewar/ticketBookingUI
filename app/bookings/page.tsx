import Link from 'next/link';
import { getUserBookings } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Ticket } from '@/lib/types';

function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">Ticket #{ticket.ticket_id}</h3>
          <p className="text-gray-600">Train {ticket.train.train_no}</p>
        </div>
        <div className="text-right">
          <p className="font-medium text-green-600">Confirmed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Journey Details</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">From:</span> {ticket.source}</p>
            <p><span className="font-medium">To:</span> {ticket.destination}</p>
            <p>
              <span className="font-medium">Seat:</span> Row {ticket.seat_row + 1}, Column {ticket.seat_col + 1}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Train Information</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Train Number:</span> {ticket.train.train_no}</p>
            <p><span className="font-medium">Train ID:</span> {ticket.train.train_id}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-700 mb-2">Route & Timing</h4>
        <div className="flex flex-wrap gap-2">
          {ticket.train.stations.map((station, index) => {
            const isJourneyStation = station === ticket.source || station === ticket.destination;
            return (
              <span
                key={index}
                className={`px-2 py-1 rounded-md text-sm ${
                  isJourneyStation
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {station}
                {ticket.train.arrival_times[station] && (
                  <span className="ml-1 text-xs opacity-75">
                    ({ticket.train.arrival_times[station]})
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default async function BookingsPage() {
  if (!isAuthenticated()) {
    redirect('/login');
  }

  const response = await getUserBookings();

  if (response.error) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error loading bookings: {response.error}
        </div>
      </div>
    );
  }

  const tickets = response.data || [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <Link
          href="/search"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Book New Ticket
        </Link>
      </div>

      {tickets.length > 0 ? (
        <div>
          <p className="text-gray-600 mb-6">
            You have {tickets.length} booking{tickets.length !== 1 ? 's' : ''}.
          </p>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.ticket_id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-xl font-medium text-gray-700 mb-2">No bookings yet</h2>
            <p className="text-gray-600 mb-6">
              You haven&apos;t made any train bookings yet. Start by searching for trains.
            </p>
            <Link
              href="/search"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Search Trains
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
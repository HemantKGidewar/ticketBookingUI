'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBooking } from '@/lib/api';
import { Train } from '@/lib/types';

interface SeatGridProps {
  train: Train;
  source: string;
  destination: string;
}

export default function SeatGrid({ train, source, destination }: SeatGridProps) {
  const router = useRouter();
  const [selectedSeat, setSelectedSeat] = useState<{ row: number; col: number } | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  const handleSeatClick = (row: number, col: number) => {
    if (train.seats[row][col] === 1) {
      return;
    }
    setSelectedSeat({ row, col });
    setBookingMessage(null);
  };

  const handleBooking = async () => {
    if (!selectedSeat) return;

    setIsBooking(true);
    setBookingMessage(null);

    try {
      const response = await createBooking({
        train_no: train.train_no,
        train_id: train.train_id,
        seat_row: selectedSeat.row,
        seat_col: selectedSeat.col,
        source,
        destination,
      });

      if (response.error) {
        setBookingMessage(`Error: ${response.error}`);
      } else {
        // Redirect to home page with success message
        router.push('/?booking=success');
        return;
      }
    } catch (error) {
      setBookingMessage('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Select Your Seat</h3>

      <div className="mb-4 text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-300 border border-gray-300 rounded mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-300 border border-gray-300 rounded mr-2"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 border border-gray-300 rounded mr-2"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>

      <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `repeat(${train.seats[0]?.length || 4}, minmax(0, 1fr))` }}>
        {train.seats.map((row, rowIndex) =>
          row.map((seat, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleSeatClick(rowIndex, colIndex)}
              disabled={seat === 1}
              className={`
                w-10 h-10 border border-gray-300 rounded text-xs font-medium
                ${seat === 1
                  ? 'bg-red-300 cursor-not-allowed text-red-800'
                  : selectedSeat?.row === rowIndex && selectedSeat?.col === colIndex
                    ? 'bg-blue-500 text-white'
                    : 'bg-green-300 hover:bg-green-400 text-green-800'
                }
              `}
            >
              {rowIndex + 1}-{colIndex + 1}
            </button>
          ))
        )}
      </div>

      {selectedSeat && (
        <div className="mb-4 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            Selected Seat: Row {selectedSeat.row + 1}, Column {selectedSeat.col + 1}
          </p>
          <p className="text-sm text-blue-600">
            Route: {source} → {destination}
          </p>
        </div>
      )}

      {bookingMessage && (
        <div className={`mb-4 p-3 rounded-md ${
          bookingMessage.startsWith('Error')
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {bookingMessage}
        </div>
      )}

      <button
        onClick={handleBooking}
        disabled={!selectedSeat || isBooking}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isBooking ? 'Booking...' : 'Book Selected Seat'}
      </button>
    </div>
  );
}
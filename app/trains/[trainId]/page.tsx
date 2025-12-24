import Link from 'next/link';
import { getTrainDetails } from '@/lib/api';
import SeatGrid from './SeatGrid';

interface TrainDetailsPageProps {
  params: {
    trainId: string;
  };
  searchParams: {
    trainNo?: string;
    source?: string;
    destination?: string;
  };
}

export default async function TrainDetailsPage({ params, searchParams }: TrainDetailsPageProps) {
  const { trainId } = params;
  const { trainNo, source, destination } = searchParams;

  if (!trainNo) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error: Train number is required
        </div>
      </div>
    );
  }

  const response = await getTrainDetails(trainId, { trainNo });

  if (response.error || !response.data) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error: {response.error || 'Failed to load train details'}
        </div>
        <Link
          href="/search"
          className="inline-block mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Search
        </Link>
      </div>
    );
  }

  const train = response.data;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          href="/search"
          className="inline-block text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Search
        </Link>
        <h1 className="text-3xl font-bold">Train {train.train_no}</h1>
        <p className="text-gray-600">Train ID: {train.train_id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Train Information</h2>

            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-2">Stations & Schedule:</h3>
              <div className="space-y-2">
                {train.stations.map((station, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-2 rounded-md ${
                      station === source || station === destination
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{station}</span>
                    {train.arrival_times[station] && (
                      <span className="text-sm text-gray-600">
                        {train.arrival_times[station]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {source && destination && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  <strong>Your Journey:</strong> {source} → {destination}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          {source && destination ? (
            <SeatGrid train={train} source={source} destination={destination} />
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
              <p className="font-medium">Source and destination required</p>
              <p className="text-sm mt-1">
                Please go back to the search page and select your journey details to book a seat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
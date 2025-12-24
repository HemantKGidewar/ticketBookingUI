import Link from 'next/link';
import { searchTrains } from '@/lib/api';
import { Train } from '@/lib/types';

interface SearchPageProps {
  searchParams: {
    source?: string;
    destination?: string;
  };
}

function SearchForm() {
  return (
    <form className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Search Trains</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <input
            type="text"
            id="source"
            name="source"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Source station"
            required
          />
        </div>
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Destination station"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Search Trains
      </button>
    </form>
  );
}

function TrainCard({ train, source, destination }: { train: Train; source?: string; destination?: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">Train {train.train_no}</h3>
          <p className="text-gray-600">Train ID: {train.train_id}</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Stations:</h4>
        <div className="flex flex-wrap gap-2">
          {train.stations.map((station, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
            >
              {station}
              {train.arrival_times[station] && (
                <span className="ml-1 text-xs text-gray-500">
                  ({train.arrival_times[station]})
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      <Link
        href={`/trains/${train.train_id}?trainNo=${train.train_no}${source ? `&source=${encodeURIComponent(source)}` : ''}${destination ? `&destination=${encodeURIComponent(destination)}` : ''}`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        View Seats & Book
      </Link>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  let trains: Train[] = [];
  let error: string | null = null;

  if (searchParams.source && searchParams.destination) {
    const response = await searchTrains({
      source: searchParams.source,
      destination: searchParams.destination,
    });

    if (response.error) {
      error = response.error;
    } else if (response.data) {
      trains = response.data;
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search Trains</h1>

      <SearchForm />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          Error: {error}
        </div>
      )}

      {searchParams.source && searchParams.destination && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Search Results: {searchParams.source} → {searchParams.destination}
          </h2>

          {trains.length > 0 ? (
            <div>
              {trains.map((train) => (
                <TrainCard
                  key={train.train_id}
                  train={train}
                  source={searchParams.source}
                  destination={searchParams.destination}
                />
              ))}
            </div>
          ) : !error && (
            <div className="text-gray-600 text-center py-8">
              No trains found for the selected route.
            </div>
          )}
        </div>
      )}

      {!searchParams.source || !searchParams.destination ? (
        <div className="text-gray-600 text-center py-8">
          Enter source and destination to search for trains.
        </div>
      ) : null}
    </div>
  );
}
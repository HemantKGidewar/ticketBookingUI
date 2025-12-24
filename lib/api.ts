import {
  ApiResponse,
  Train,
  Ticket,
  BookingRequest,
  TrainSearchParams,
  TrainDetailsParams
} from './types';

const API_BASE_URL = 'http://localhost:8080';

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<T> = await response.json();
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function searchTrains(params: TrainSearchParams): Promise<ApiResponse<Train[]>> {
  const searchParams = new URLSearchParams({
    source: params.source,
    destination: params.destination,
  });

  return apiCall<Train[]>(`/events?${searchParams}`);
}

export async function getTrainDetails(trainId: string, params: TrainDetailsParams): Promise<ApiResponse<Train>> {
  const searchParams = new URLSearchParams({
    trainNo: params.trainNo,
  });

  return apiCall<Train>(`/events/${trainId}?${searchParams}`);
}

export async function createBooking(booking: BookingRequest): Promise<ApiResponse<Ticket>> {
  return apiCall<Ticket>('/bookings', {
    method: 'POST',
    body: JSON.stringify(booking),
  });
}

export async function getUserBookings(): Promise<ApiResponse<Ticket[]>> {
  return apiCall<Ticket[]>('/bookings/me');
}
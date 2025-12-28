import {
  ApiResponse,
  Train,
  Ticket,
  BookingRequest,
  TrainSearchParams,
  TrainDetailsParams
} from './types';
import { getAccessToken, getRefreshToken, isTokenExpired, setJwtTokens, logout } from './auth';
import { refreshToken } from './authApi';

const API_BASE_URL = 'http://localhost:8080';

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Handle JWT token refresh if needed
    let accessToken = getAccessToken();
    if (accessToken && isTokenExpired(accessToken)) {
      console.log('Access token expired, attempting refresh...');
      try {
        const refreshTokenValue = getRefreshToken();
        if (refreshTokenValue) {
          const refreshResponse = await refreshToken({ token: refreshTokenValue });
          setJwtTokens({
            accessToken: refreshResponse.accessToken,
            refreshToken: refreshResponse.token
          });
          accessToken = refreshResponse.accessToken;
          console.log('Token refreshed successfully');
        } else {
          console.log('No refresh token available, user needs to login again');
          logout();
          return { data: null, error: 'Session expired, please login again' };
        }
      } catch (refreshError) {
        console.log('Token refresh failed, logging out user');
        logout();
        return { data: null, error: 'Session expired, please login again' };
      }
    }

    // Add JWT authorization if token exists
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    // Handle 401 Unauthorized - token might be invalid
    if (response.status === 401 && accessToken) {
      console.log('API returned 401, attempting token refresh...');
      try {
        const refreshTokenValue = getRefreshToken();
        if (refreshTokenValue) {
          const refreshResponse = await refreshToken({ token: refreshTokenValue });
          setJwtTokens({
            accessToken: refreshResponse.accessToken,
            refreshToken: refreshResponse.token
          });

          // Retry the original request with new token
          headers['Authorization'] = `Bearer ${refreshResponse.accessToken}`;
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers,
            ...options,
          });

          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }

          const retryResult: ApiResponse<T> = await retryResponse.json();
          return retryResult;
        }
      } catch (refreshError) {
        logout();
        return { data: null, error: 'Session expired, please login again' };
      }
    }

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
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface Train {
  train_id: string;
  train_no: string;
  seats: number[][];
  stations: string[];
  arrival_times: Record<string, string>;
}

export interface Ticket {
  ticket_id: string;
  source: string;
  destination: string;
  seat_row: number;
  seat_col: number;
  train: Train;
}

export interface BookingRequest {
  train_no: string;
  train_id: string;
  seat_row: number;
  seat_col: number;
  source: string;
  destination: string;
}

export interface TrainSearchParams {
  source: string;
  destination: string;
}

export interface TrainDetailsParams {
  trainNo: string;
}
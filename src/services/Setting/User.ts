export type AvailabilitySlot = {
  day_of_week: string;
  start_time: string;
  end_time: string;
};

export type User = {
  first_name?: string;
  last_name?: string;
  email?: string;
  dob?: string;

  weight?: string | number;
  height?: string | number;
  goal_weight?: string | number;

  price?: string | number;
  coach_description?: string;
  avg_rating?: number | null;
  reviews?: unknown[];
  active_clients?: number;
  availability?: AvailabilitySlot[];
};
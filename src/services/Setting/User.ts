export type AvailabilitySlot = {
  day_of_week: string;
  start_time: string;
  end_time: string;
};

export type Certification = {
  name: string;
  provider: string;
  description?: string | null;
  issued_date?: string | null;
  expires_date?: string | null;
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

  certifications?: Certification[];
};
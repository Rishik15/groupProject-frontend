export type CalendarEventType =
  | "workout"
  | "coach_session"
  | "meal"
  | "reminder"
  | "other";

export type CoachSessionStatus = "scheduled" | "completed" | "cancelled";

export type WorkoutCalendarStatus =
  | "scheduled"
  | "active"
  | "completed"
  | "missed";

export interface CalendarEvent {
  id: string;
  eventId: number;
  userId: number;

  title: string;
  date: string;
  startTime: string;
  endTime: string;
  eventType: CalendarEventType;
  description: string;
  notes: string;

  workoutPlanId: number | null;
  workoutPlanName?: string | null;
  workoutDayId: number | null;
  workoutDayLabel?: string | null;
  workoutDayOrder?: number | null;

  sessionId?: number | null;
  sessionStartedAt?: string | null;
  sessionEndedAt?: string | null;
  workoutStatus?: WorkoutCalendarStatus | null;

  coachSessionId?: number | null;
  contractId?: number | null;
  coachId?: number | null;
  clientId?: number | null;
  status?: CoachSessionStatus | null;

  coachFirstName?: string | null;
  coachLastName?: string | null;
  clientFirstName?: string | null;
  clientLastName?: string | null;
  clientEmail?: string | null;
}

export interface CreateWorkoutEventInput {
  event_date: string;
  start_time: string;
  end_time: string;
  description: string;
  notes?: string;
  workout_plan_id: number;
  workout_day_id: number;
}

export interface UpdateWorkoutEventInput {
  event_date?: string;
  start_time?: string;
  end_time?: string;
  description?: string;
  notes?: string;
  workout_plan_id?: number;
  workout_day_id?: number;
}

export interface CreateCoachSessionEventInput {
  contract_id: number;
  event_date: string;
  start_time: string;
  end_time: string;
  description: string;
  notes?: string;
}

export interface UpdateCoachSessionEventInput {
  contract_id?: number;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  description?: string;
  notes?: string;
}

export interface CoachSessionConflict {
  id: string;
  eventId: number;
  userId: number;

  title: string;
  date: string;
  startTime: string;
  endTime: string;
  eventType: "coach_session";
  description: string;
  notes: string;

  coachSessionId?: number | null;
  contractId?: number | null;
  coachId?: number | null;
  clientId?: number | null;
  status?: CoachSessionStatus | null;

  clientFirstName?: string | null;
  clientLastName?: string | null;
  clientEmail?: string | null;
}

export interface CoachSessionApiError {
  error: string;
  conflicts?: CoachSessionConflict[];
}

export interface UserWorkoutPlan {
  plan_id: number;
  plan_name: string;
  description: string | null;
  source: "authored" | "assigned";
  total_exercises: number;
  total_days?: number;
}

export interface WorkoutPlanDay {
  day_id: number;
  plan_id: number;
  day_order: number;
  day_label: string | null;
  total_exercises: number;
}

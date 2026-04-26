export type CalendarEventType =
  | "workout"
  | "coach_session"
  | "meal"
  | "reminder"
  | "other";

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
  event_date: string;
  start_time: string;
  end_time: string;
  description: string;
  notes?: string;
}

export interface UpdateCoachSessionEventInput {
  event_date?: string;
  start_time?: string;
  end_time?: string;
  description?: string;
  notes?: string;
}

export interface UserWorkoutPlan {
  plan_id: number;
  plan_name: string;
  description: string | null;
  source: "authored" | "assigned";
  total_exercises: number;
}

export interface WorkoutPlanDay {
  day_id: number;
  plan_id: number;
  day_order: number;
  day_label: string | null;
  total_exercises: number;
}
export interface UserWorkoutPlan {
  plan_id: number;
  plan_name: string;
  description: string | null;
  source: "authored" | "assigned";
  total_exercises: number;
  total_days?: number;
}

export type SessionStatus = "not_started" | "active" | "completed" | "missed";

export interface ScheduledWorkoutSession {
  eventId: number;
  title: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  workoutPlanId: number | null;
  workoutPlanName: string | null;
  workoutDayId: number | null;
  workoutDayLabel: string | null;
  workoutDayOrder?: number | null;
  sessionId: number | null;
  sessionStatus: SessionStatus;
  canStart: boolean;
}

export interface ActiveWorkoutSession {
  sessionId: number;
  eventId: number | null;
  workoutPlanId: number | null;
  workoutPlanName: string | null;
  workoutDayId: number | null;
  workoutDayLabel: string | null;
  title: string | null;
  startedAt: string;
  endedAt?: string | null;
  notes?: string | null;
}

import type { Key } from "@heroui/react";

export type ActivityLogTabKey = "strength" | "cardio" | "previous";

export interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: number | null;
  initialTab?: ActivityLogTabKey;
  onFinished?: () => void;
  onLogged?: () => void;
}

export interface ActiveSession {
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

export interface SessionExercise {
  exerciseId: number;
  exerciseName: string;
  equipment: string | null;
  videoUrl: string | null;
  description: string | null;
  orderInWorkout: number;
  setsGoal: number | null;
  repsGoal: number | null;
  weightGoal: number | null;
}

export interface StrengthLog {
  setLogId: number;
  sessionId: number;
  exerciseId: number;
  exerciseName: string;
  setNumber: number;
  reps: number | null;
  weight: number | null;
  rpe: number | null;
  performedAt: string;
  startedAt?: string | null;
  endedAt?: string | null;
  workoutPlanName?: string | null;
  workoutDayLabel?: string | null;
  canEdit?: boolean;
}

export interface CardioLog {
  cardioLogId: number;
  sessionId: number | null;
  userId: number;
  performedAt: string;
  steps: number | null;
  distanceKm: number | null;
  durationMin: number | null;
  calories: number | null;
  avgHr: number | null;
  canEdit?: boolean;
}

export interface EditingStrength {
  setLogId: number;
  setNumber: string;
  reps: string;
  weight: string;
  rpe: string;
}

export interface EditingCardio {
  cardioLogId: number;
  steps: string;
  distanceKm: string;
  durationMin: string;
  calories: string;
  avgHr: string;
}

export type SelectedExerciseKey = Key | null;

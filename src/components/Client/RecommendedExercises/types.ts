import type React from "react";

export type ExerciseGoal = {
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  category: string;
};

export type PredefinedPlansRequest = {
  category: string;
  days_per_week: number;
  duration: string;
  level: string;
};

export type WorkoutPlan = {
  plan_id: number;
  plan_name: string;
  description: string;
  exercise_count?: number;
};

export type PredefinedPlansResponse = {
  plans: WorkoutPlan[];
};
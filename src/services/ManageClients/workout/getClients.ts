import api from "../../api";

export type ManageWorkoutStatus =
  | "scheduled"
  | "active"
  | "completed"
  | "missed";

export interface ManageWorkoutEvent {
  id: string;
  eventId: number;
  userId?: number;
  eventType: "workout" | "coach_session" | string;
  title: string;
  description?: string;
  notes?: string;
  date: string;
  startTime: string;
  endTime: string;

  workoutPlanId?: number | null;
  workoutPlanName?: string | null;
  workoutDayId?: number | null;
  workoutDayLabel?: string | null;
  workoutDayOrder?: number | null;

  sessionId?: number | null;
  sessionStartedAt?: string | null;
  sessionEndedAt?: string | null;
  workoutStatus?: ManageWorkoutStatus | null;
}

export interface ManageWorkoutPlan {
  plan_id: number;
  plan_name: string;
  description?: string | null;
  source: string;
  total_exercises: number;
}

export interface ManageWorkoutPlanDay {
  day_id: number;
  plan_id?: number;
  day_order: number;
  day_label: string;
  total_exercises: number;
}

export interface CreateManageWorkoutEventInput {
  contract_id: number;
  event_date: string;
  start_time: string;
  end_time: string;
  description: string;
  notes?: string;
  workout_plan_id: number;
  workout_day_id: number;
}

export interface UpdateManageWorkoutEventInput {
  contract_id: number;
  event_id: number;
  event_date: string;
  start_time: string;
  end_time: string;
  description: string;
  notes?: string;
  workout_plan_id: number;
  workout_day_id: number;
}

export const getManageWorkoutEvents = async (
  contractId: number,
  startDate: string,
  endDate: string,
): Promise<ManageWorkoutEvent[]> => {
  const res = await api.get("/manage/workouts/events", {
    params: {
      contract_id: contractId,
      start_date: startDate,
      end_date: endDate,
    },
  });

  return res.data || [];
};

export const createManageWorkoutEvent = async (
  input: CreateManageWorkoutEventInput,
): Promise<ManageWorkoutEvent> => {
  const res = await api.post("/manage/workouts/events", input);

  return res.data;
};

export const updateManageWorkoutEvent = async (
  input: UpdateManageWorkoutEventInput,
): Promise<ManageWorkoutEvent> => {
  const res = await api.patch("/manage/workouts/events", input);

  return res.data;
};

export const deleteManageWorkoutEvent = async (
  contractId: number,
  eventId: number,
) => {
  const res = await api.delete("/manage/workouts/events", {
    params: {
      contract_id: contractId,
      event_id: eventId,
    },
  });

  return res.data;
};

export const getManageClientWorkoutPlans = async (
  contractId: number,
): Promise<ManageWorkoutPlan[]> => {
  const res = await api.get("/manage/workouts/client-plans", {
    params: {
      contract_id: contractId,
    },
  });

  return res.data || [];
};

export const getManageCoachWorkoutPlans = async (): Promise<
  ManageWorkoutPlan[]
> => {
  const res = await api.get("/manage/workouts/coach-plans");

  return res.data || [];
};

export const getManageSystemWorkoutPlans = async (): Promise<
  ManageWorkoutPlan[]
> => {
  const res = await api.get("/manage/workouts/system-plans");

  return res.data || [];
};

export const getManageClientWorkoutPlanDays = async (
  contractId: number,
  planId: number,
): Promise<ManageWorkoutPlanDay[]> => {
  const res = await api.get("/manage/workouts/plan-days", {
    params: {
      contract_id: contractId,
      plan_id: planId,
    },
  });

  return res.data || [];
};

export const getManageCoachWorkoutPlanDays = async (
  planId: number,
): Promise<ManageWorkoutPlanDay[]> => {
  const res = await api.get("/manage/workouts/coach-plan-days", {
    params: {
      plan_id: planId,
    },
  });

  return res.data || [];
};

export const assignWorkoutPlanToClient = async (
  contractId: number,
  planId: number,
  note?: string,
) => {
  const res = await api.post("/manage/workouts/assign-plan", {
    contract_id: contractId,
    plan_id: planId,
    note,
  });

  return res.data;
};

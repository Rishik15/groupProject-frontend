import api from "../api";

import type {
  CalendarEvent,
  CreateCoachSessionEventInput,
  CreateWorkoutEventInput,
  UpdateCoachSessionEventInput,
  UpdateWorkoutEventInput,
  UserWorkoutPlan,
  WorkoutPlanDay,
} from "@/utils/Interfaces/Calendar/calendar";

export const getCalendarEvents = async (
  startDate: string,
  endDate: string,
): Promise<CalendarEvent[]> => {
  const res = await api.get("/calendar/events", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return res.data.events || [];
};

export const createWorkoutEvent = async (
  input: CreateWorkoutEventInput,
): Promise<CalendarEvent> => {
  const res = await api.post("/calendar/events", input);
  return res.data.event;
};

export const updateWorkoutEvent = async (
  eventId: number,
  input: UpdateWorkoutEventInput,
): Promise<CalendarEvent> => {
  const res = await api.patch("/calendar/events", input, {
    params: {
      event_id: eventId,
    },
  });

  return res.data.event;
};

export const deleteWorkoutEvent = async (eventId: number) => {
  const res = await api.delete("/calendar/events", {
    params: {
      event_id: eventId,
    },
  });

  return res.data;
};

export const getContractCalendarEvents = async (
  contractId: number,
  startDate: string,
  endDate: string,
): Promise<CalendarEvent[]> => {
  const res = await api.get("/calendar/contracts/events", {
    params: {
      contract_id: contractId,
      start_date: startDate,
      end_date: endDate,
    },
  });

  return res.data.events || [];
};

export const createCoachSessionEvent = async (
  contractId: number,
  input: CreateCoachSessionEventInput,
): Promise<CalendarEvent> => {
  const res = await api.post("/calendar/contracts/events", input, {
    params: {
      contract_id: contractId,
    },
  });

  return res.data.event;
};

export const updateCoachSessionEvent = async (
  contractId: number,
  eventId: number,
  input: UpdateCoachSessionEventInput,
): Promise<CalendarEvent> => {
  const res = await api.patch("/calendar/contracts/events", input, {
    params: {
      contract_id: contractId,
      event_id: eventId,
    },
  });

  return res.data.event;
};

export const deleteCoachSessionEvent = async (
  contractId: number,
  eventId: number,
) => {
  const res = await api.delete("/calendar/contracts/events", {
    params: {
      contract_id: contractId,
      event_id: eventId,
    },
  });

  return res.data;
};

export const getMyWorkoutPlans = async (): Promise<UserWorkoutPlan[]> => {
  const res = await api.get("/workouts/my-workouts");
  return res.data.workouts || [];
};

export const getWorkoutPlanDays = async (
  planId: number,
): Promise<WorkoutPlanDay[]> => {
  const res = await api.get("/workouts/plan-days", {
    params: {
      plan_id: planId,
    },
  });

  return res.data.days || [];
};

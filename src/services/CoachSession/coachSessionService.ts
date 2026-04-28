import type { AxiosError } from "axios";
import api from "../api";

import type {
  CalendarEvent,
  CoachSessionApiError,
  CoachSessionStatus,
  CreateCoachSessionEventInput,
  UpdateCoachSessionEventInput,
} from "@/utils/Interfaces/Calendar/calendar";

export const getCoachSessionEvents = async (
  startDate: string,
  endDate: string,
): Promise<CalendarEvent[]> => {
  const res = await api.get("/coachsession/events", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return res.data.events || [];
};

export const createCoachSessionEvent = async (
  input: CreateCoachSessionEventInput,
): Promise<CalendarEvent> => {
  const res = await api.post("/coachsession/events", input);

  return res.data.event;
};

export const updateCoachSessionEvent = async (
  eventId: number,
  input: UpdateCoachSessionEventInput,
): Promise<CalendarEvent> => {
  const res = await api.patch("/coachsession/events", input, {
    params: {
      event_id: eventId,
    },
  });

  return res.data.event;
};

export const deleteCoachSessionEvent = async (eventId: number) => {
  const res = await api.delete("/coachsession/events", {
    params: {
      event_id: eventId,
    },
  });

  return res.data;
};

export const updateCoachSessionStatus = async (
  eventId: number,
  status: CoachSessionStatus,
): Promise<CalendarEvent> => {
  const res = await api.patch(
    "/coachsession/status",
    { status },
    {
      params: {
        event_id: eventId,
      },
    },
  );

  return res.data.event;
};

export const getCoachSessionError = (error: unknown): CoachSessionApiError => {
  const axiosError = error as AxiosError<CoachSessionApiError>;

  return {
    error:
      axiosError.response?.data?.error ||
      "Something went wrong with coach sessions.",
    conflicts: axiosError.response?.data?.conflicts || [],
  };
};

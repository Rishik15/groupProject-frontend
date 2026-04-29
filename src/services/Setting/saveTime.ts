import api from "../api";
import type { AvailabilitySlot } from "./User";

export const updateCoachAvailability = async (
  availability: AvailabilitySlot[],
  mode = "coach",
) => {
  const payload = {
    mode,
    num_days: availability.length,
    day_of_week: availability.map((slot) => slot.day_of_week),
    start_time: availability.map((slot) => slot.start_time),
    end_time: availability.map((slot) => slot.end_time),
    recurring: availability.map(() => true),
    active: availability.map(() => true),
  };

  const res = await api.post("/coach/availability/update", payload);
  return res.data;
};

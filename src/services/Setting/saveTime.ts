import api from "../api";

type AvailabilitySlot = {
  day_of_week: string;
  start_time: string;
  end_time: string;
};

export const updateCoachAvailability = async (
  availability: AvailabilitySlot[],
) => {
  const res = await api.post("/coach/availability/update", {
    num_days: availability.length,
    day_of_week: availability.map((s) => s.day_of_week),
    start_time: availability.map((s) => s.start_time),
    end_time: availability.map((s) => s.end_time),
    recurring: availability.map(() => true),
    active: availability.map(() => true),
  });

  return res.data;
};
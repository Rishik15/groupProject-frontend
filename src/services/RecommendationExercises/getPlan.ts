import api from "../api";
import type { Filters } from "./types";

const get_plans = async (filters: Filters) => {
  const res = await api.post("/workouts/predefined", filters);

  return res.data;
};

export default get_plans;
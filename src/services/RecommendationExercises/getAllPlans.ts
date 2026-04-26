import api from "../api";

const get_all_plans = async () => {
  const res = await api.post("/workouts/predefined", {});

  return res;
};

export default get_all_plans;
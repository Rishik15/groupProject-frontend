import api from "../api";

const assign_plan = async (plan_id: number) => {
  const res = await api.post("/workouts/predefined/assign", {
    plan_id,
  });

  return res;
};

export default assign_plan;
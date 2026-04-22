import axios from "axios";

const assign_plan = async (plan_id: number) => {
  const res = await axios.post(
    "http://localhost:8080/workouts/predefined/assign",
    { plan_id },
    { withCredentials: true }
  );

  return res;
};

export default assign_plan;
import { useState, useEffect } from "react";
import axios from "axios";
import PlanCard, { type MealPlan } from "./PlanCard";

const BASE_URL = "http://localhost:8080";

export default function AssignedPlans() {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URL}/nutrition/meal-plans/my-plans`, { withCredentials: true })
      .then((res) => setPlans(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white border border-[#E6E6EE] rounded-2xl p-5">
          <div className="h-4 w-40 rounded bg-gray-200 animate-pulse mb-2" />
          <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
        </div>
      ))}
    </div>
  );

  if (plans.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-sm font-medium text-black">No plans yet</p>
      <p className="text-xs text-[#72728A] mt-1">Assign a plan from the Meal Plans tab</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 items-center">
      {plans.map((plan) => (
        <div key={plan.meal_plan_id} className="w-full max-w-3xl">
          <PlanCard plan={plan} />
        </div>
      ))}
    </div>
  );
}
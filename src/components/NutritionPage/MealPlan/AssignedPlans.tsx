import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

interface Meal {
  meal_id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal_type: string;
  day_of_week: string;
  servings: number;
}

interface MealPlan {
  meal_plan_id: number;
  plan_name: string;
  start_date: string;
  end_date: string;
  total_calories: number;
}

interface PlanDetail {
  plan_name: string;
  total_calories: number;
  meals: Meal[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function PlanCard({ plan }: { plan: MealPlan }) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState<PlanDetail | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleExpand() {
    if (!expanded && !detail) {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/nutrition/meal-plans/detail`, { meal_plan_id: plan.meal_plan_id }, { withCredentials: true });
      setDetail(res.data);
      setLoading(false);
    }
    setExpanded((v) => !v);
  }

  return (
    <div className="bg-white border rounded-2xl overflow-hidden transition-all" style={{ borderColor: expanded ? "#5B5EF4" : "#E6E6EE", borderWidth: "0.5px" }}>
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-black">{plan.plan_name}</p>
          <p className="text-xs text-[#72728A] mt-1">{plan.start_date} → {plan.end_date}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5B5EF4] bg-[#5B5EF4]/10 px-3 py-0.5 rounded-full">{plan.total_calories} calories</span>
          <button
            onClick={handleExpand}
            className="text-xs border rounded-lg px-3 py-1 transition-colors"
            style={{ borderColor: expanded ? "#5B5EF4" : "#E6E6EE", color: expanded ? "#5B5EF4" : "#72728A" }}
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#E6E6EE] px-5 py-4">
          {loading ? (
            <p className="text-xs text-[#72728A]">Loading...</p>
          ) : detail ? (
            <div className="flex flex-col gap-4">
              {DAYS.map((day) => {
                const dayMeals = detail.meals.filter((m) => m.day_of_week === day);
                if (dayMeals.length === 0) return null;
                return (
                  <div key={day}>
                    <p className="text-xs font-semibold text-[#72728A] uppercase tracking-wider mb-2">{day}</p>
                    <div className="flex flex-col gap-2">
                      {dayMeals.map((meal) => (
                        <div key={meal.meal_id} className="flex items-center justify-between px-4 py-2 bg-[#F7F7FB] rounded-xl text-sm">
                          <div>
                            <p className="font-medium text-black">{meal.name}</p>
                            <p className="text-xs text-[#72728A] capitalize">{meal.meal_type} · {meal.servings} serving{meal.servings !== 1 ? "s" : ""}</p>
                          </div>
                          <div className="flex gap-2 text-xs text-[#72728A]">
                            <span>{meal.calories} kcal</span>
                            <span>{meal.protein}g P</span>
                            <span>{meal.carbs}g C</span>
                            <span>{meal.fats}g F</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function AssignedPlans() {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URL}/nutrition/meal-plans/my-plans`, { withCredentials: true })
      .then((res) => setPlans(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white border border-[#E6E6EE] rounded-2xl p-5">
            <div className="h-4 w-40 rounded bg-gray-200 animate-pulse mb-2" />
            <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-black">No assigned plans yet</p>
        <p className="text-xs text-[#72728A] mt-1">Assign a plan from the Meal Plans tab</p>
      </div>
    );
  }

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
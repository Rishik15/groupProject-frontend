import { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080";
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

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

export interface MealPlan {
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

export default function PlanCard({ plan }: { plan: MealPlan }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [detail, setDetail] = useState<PlanDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [planName, setPlanName] = useState(plan.plan_name);
  const [systemMeals, setSystemMeals] = useState<{ meal_id: number; name: string }[]>([]);
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [selectedType, setSelectedType] = useState("breakfast");
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);

  async function loadDetail() {
    setLoading(true);
    const res = await axios.post(`${BASE_URL}/nutrition/meal-plans/detail`, { meal_plan_id: plan.meal_plan_id }, { withCredentials: true });
    setDetail(res.data);
    setLoading(false);
  }

  async function handleExpand() {
    if (!expanded && !detail) await loadDetail();
    setExpanded((v) => !v);
  }

  async function handleEdit() {
    if (!detail) await loadDetail();
    const res = await axios.get(`${BASE_URL}/nutrition/meals`, { withCredentials: true });
    setSystemMeals(res.data);
    setEditing(true);
    setExpanded(true);
  }

  async function put(body: object) {
    await axios.put(`${BASE_URL}/nutrition/meal-plans/update`, { meal_plan_id: plan.meal_plan_id, ...body }, { withCredentials: true });
    await loadDetail();
  }

  const selectClass = "text-sm border border-[#E6E6EE] rounded-xl px-3 py-2 bg-white focus:outline-none";

  return (
    <div className="bg-white border rounded-2xl overflow-hidden transition-all" style={{ borderColor: expanded ? "#5B5EF4" : "#E6E6EE", borderWidth: "0.5px" }}>
      <div className="flex items-center justify-between px-5 py-4">
        {editing ? (
          <input value={planName} onChange={(e) => setPlanName(e.target.value)}
            className="text-sm font-semibold border border-[#E6E6EE] rounded-lg px-3 py-1 focus:outline-none focus:border-[#5B5EF4]" />
        ) : (
          <div>
            <p className="text-sm font-semibold text-black">{plan.plan_name}</p>
            <p className="text-xs text-[#72728A] mt-1">{plan.start_date} → {plan.end_date}</p>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5B5EF4] bg-[#5B5EF4]/10 px-3 py-0.5 rounded-full">{plan.total_calories} kcal</span>
          {editing ? (
            <button onClick={() => put({ plan_name: planName }).then(() => setEditing(false))} className="text-xs bg-[#5B5EF4] text-white rounded-lg px-3 py-1">Save</button>
          ) : (
            <button onClick={handleEdit} className="text-xs border border-[#E6E6EE] text-[#72728A] rounded-lg px-3 py-1">Edit</button>
          )}
          <button onClick={handleExpand} className="text-xs border rounded-lg px-3 py-1 transition-colors"
            style={{ borderColor: expanded ? "#5B5EF4" : "#E6E6EE", color: expanded ? "#5B5EF4" : "#72728A" }}>
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#E6E6EE] px-5 py-4 flex flex-col gap-4">
          {loading ? <p className="text-xs text-[#72728A]">Loading...</p> : detail ? (
            <>
              {DAYS.map((day) => {
                const dayMeals = detail.meals.filter((m) => m.day_of_week === day);
                if (dayMeals.length === 0) return null;
                return (
                  <div key={day}>
                    <p className="text-xs font-semibold text-[#72728A] uppercase tracking-wider mb-2">{day}</p>
                    <div className="flex flex-col gap-2">
                      {dayMeals.map((meal) => (
                        <div key={`${meal.meal_id}-${meal.day_of_week}-${meal.meal_type}`} className="flex items-center justify-between px-4 py-2 bg-[#F7F7FB] rounded-xl text-sm">
                          <div>
                            <p className="font-medium text-black">{meal.name}</p>
                            <p className="text-xs text-[#72728A] capitalize">{meal.meal_type}</p>
                          </div>
                          {editing ? (
                            <div className="flex items-center gap-2">
                              <input type="number" min={0.5} step={0.5} defaultValue={meal.servings}
                                onBlur={(e) => put({ update_servings: [{ meal_id: meal.meal_id, day_of_week: meal.day_of_week, meal_type: meal.meal_type, servings: Number(e.target.value) }] })}
                                className="w-14 text-center text-xs border border-[#E6E6EE] rounded-lg py-1 focus:outline-none" />
                              <span className="text-xs text-[#72728A]">servings</span>
                              <button onClick={() => put({ remove_meals: [{ meal_id: meal.meal_id, day_of_week: meal.day_of_week, meal_type: meal.meal_type }] })} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                            </div>
                          ) : (
                            <div className="flex gap-2 text-xs text-[#72728A]">
                              <span>{meal.calories} kcal</span>
                              <span>{meal.protein}g P</span>
                              <span>{meal.carbs}g C</span>
                              <span>{meal.fats}g F</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {editing && (
                <div className="flex flex-col gap-2 border-t border-[#E6E6EE] pt-4">
                  <p className="text-xs font-semibold text-[#72728A] uppercase tracking-wider">Add a Meal</p>
                  <div className="flex gap-2">
                    <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className={selectClass}>
                      {DAYS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className={`${selectClass} capitalize`}>
                      {MEAL_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                    <select value={selectedMealId ?? ""} onChange={(e) => setSelectedMealId(Number(e.target.value))} className={`flex-1 ${selectClass}`}>
                      <option value="">Select meal...</option>
                      {systemMeals.map((m) => <option key={m.meal_id} value={m.meal_id}>{m.name}</option>)}
                    </select>
                    <button onClick={() => selectedMealId && put({ add_meals: [{ meal_id: selectedMealId, day_of_week: selectedDay, meal_type: selectedType, servings: 1 }] })}
                      className="bg-[#5B5EF4] text-white text-xs font-medium px-4 py-2 rounded-xl hover:bg-[#4B4EE4]">Add</button>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
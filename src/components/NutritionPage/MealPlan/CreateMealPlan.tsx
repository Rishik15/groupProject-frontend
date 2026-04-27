import { useState, useEffect } from "react";
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
}

interface MealSlot {
  day: string;
  meal_type: string;
  meal_id: number;
  meal_name: string;
  servings: number;
}

function isMonday(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).getDay() === 1;
}

function MealBrowser({ onSelect, onClose }: { onSelect: (meal: Meal) => void; onClose: () => void }) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`${BASE_URL}/nutrition/meals`, { withCredentials: true }).then((res) => setMeals(res.data));
  }, []);

  const filtered = meals.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg flex flex-col gap-4 shadow-xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-black">Select a Meal</p>
          <button onClick={onClose} className="text-[#72728A] hover:text-black">✕</button>
        </div>
        <input placeholder="Search meals..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm border border-[#E6E6EE] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5B5EF4]" />
        <div className="flex flex-col gap-2 overflow-y-auto">
          {filtered.map((meal) => (
            <button key={meal.meal_id} onClick={() => onSelect(meal)}
              className="flex items-center justify-between text-left px-4 py-3 border border-[#E6E6EE] rounded-xl hover:border-[#5B5EF4] transition-colors">
              <p className="text-sm font-medium text-black">{meal.name}</p>
              <div className="flex gap-4 text-xs text-[#72728A]">
                <span>{meal.calories} kcal</span>
                <span>{meal.protein}g P</span>
                <span>{meal.carbs}g C</span>
                <span>{meal.fats}g F</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CreateMealPlan() {
  const [planName, setPlanName] = useState("");
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [selectedType, setSelectedType] = useState("breakfast");
  const [slots, setSlots] = useState<MealSlot[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showBrowser, setShowBrowser] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSelectMeal(meal: Meal) {
    setSlots((prev) => [...prev, { day: selectedDay, meal_type: selectedType, meal_id: meal.meal_id, meal_name: meal.name, servings: 1 }]);
    setShowBrowser(false);
  }

  function removeSlot(index: number) {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!planName.trim()) { setError("Plan name is required."); return; }
    if (slots.length === 0) { setError("Add at least one meal."); return; }
    if (!startDate) { setError("Please select a start date."); return; }
    if (!endDate) { setError("Please select an end date."); return; }
    if (!isMonday(startDate)) { setError("Start date must be a Monday."); return; }
    if (endDate < startDate) { setError("End date must be after start date."); return; }
    setError(null);

    try {
      await axios.post(`${BASE_URL}/nutrition/meal-plans/create`, {
        plan_name: planName,
        start_date: startDate,
        end_date: endDate,
        meals: slots.map(({ day, meal_type, meal_id, servings }) => ({
          day_of_week: day, meal_type, meal_id, servings,
        }))
      }, { withCredentials: true });

      setSuccess(true);
      setPlanName(""); setSlots([]); setStartDate(""); setEndDate("");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create plan.");
    }
  }

  const inputClass = "w-full text-sm border border-[#E6E6EE] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5B5EF4] bg-white";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-base font-semibold text-black">Create Meal Plan</p>
        <p className="text-xs text-[#72728A] mt-0.5">Build a weekly meal plan from your meal library</p>
      </div>

      {success && <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3">Plan created successfully!</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}

      <div className="flex gap-6 items-start">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#72728A] uppercase tracking-wider">Plan Name</label>
            <input placeholder="e.g. High Protein Week" value={planName} onChange={(e) => { setPlanName(e.target.value); setSuccess(false); }} className={inputClass} />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-semibold text-[#72728A] uppercase tracking-wider">Start Date (Monday)</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-semibold text-[#72728A] uppercase tracking-wider">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#72728A] uppercase tracking-wider">Add a Meal</label>
            <p className="text-xs text-[#72728A]">Select a day and meal type, then click Add Meal to pick from the library.</p>
            <div className="flex gap-3">
              <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className={inputClass}>
                {DAYS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className={`${inputClass} capitalize`}>
                {MEAL_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <button onClick={() => setShowBrowser(true)} className="shrink-0 bg-[#5B5EF4] text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[#4B4EE4] transition-colors">
                + Add Meal
              </button>
            </div>
          </div>
        </div>

        <div className="w-80 shrink-0 bg-white border border-[#E6E6EE] rounded-2xl p-5 flex flex-col gap-3">
          <p className="text-sm font-semibold text-black">
            Added Meals <span className="text-[#72728A] font-normal">({slots.length})</span>
          </p>
          {slots.length === 0 ? (
            <p className="text-xs text-[#72728A]">No meals added yet.</p>
          ) : (
            slots.map((slot, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 border border-[#E6E6EE] rounded-xl">
                <div>
                  <p className="text-sm font-medium text-black">{slot.meal_name}</p>
                  <p className="text-xs text-[#72728A] capitalize">{slot.day} · {slot.meal_type}</p>
                </div>
                <button onClick={() => removeSlot(i)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
              </div>
            ))
          )}
          <button onClick={handleSave} className="w-full bg-[#5B5EF4] text-white text-sm font-medium py-2.5 rounded-xl hover:bg-[#4B4EE4] transition-colors mt-2">
            Save Plan
          </button>
        </div>
      </div>

      {showBrowser && <MealBrowser onSelect={handleSelectMeal} onClose={() => setShowBrowser(false)} />}
    </div>
  );
}
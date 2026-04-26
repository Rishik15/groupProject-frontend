import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../utils/auth/AuthContext";
import CategoryFilter from "../../components/CreateWorkoutPlan/CategoryFilter";
import ExerciseCard, { type Exercise } from "../../components/CreateWorkoutPlan/ExerciseCard";
import SelectedExerciseList, { type SelectedExercise } from "../../components/CreateWorkoutPlan/SelectedExerciseList";
import ExerciseModal from "../../components/CreateWorkoutPlan/ExerciseModal";
import MyPlans from "../../components/CreateWorkoutPlan/MyPlans";
import CreateExerciseForm from "../../components/CreateExercises/CreateExerciseForm";
import MyExercises from "../../components/CreateExercises/MyExercises";
import DaySetup from "../../components/CreateWorkoutPlan/DaySetup";
import DayTabs from "../../components/CreateWorkoutPlan/DayTabs";
import { getExercises } from "../../services/workout/getExercises";

const BASE_URL = "http://localhost:8080";

interface Day {
  label: string;
  exercises: SelectedExercise[];
}

export default function CreateWorkoutPlan() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const isCoach = role === "coach";

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);
  const [activeTab, setActiveTab] = useState<"browse" | "plans" | "create" | "exercises">("browse");
  const [planName, setPlanName] = useState("");
  const [days, setDays] = useState<Day[] | null>(null);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    async function load() {
      const equipmentFilter = selectedCategory === "All" ? [] : [selectedCategory];
      const data = await getExercises(search, equipmentFilter);
      setExercises(data);
    }
    load();
  }, [selectedCategory, search]);

  function handleSetupDays(name: string, dayLabels: string[]) {
    setPlanName(name);
    setDays(dayLabels.map((label) => ({ label, exercises: [] })));
    setActiveDay(0);
  }

  function handleAdd(exercise: Exercise) {
    if (!days) return;
    setDays((prev) => prev!.map((d, i) =>
      i === activeDay ? { ...d, exercises: [...d.exercises, { exercise, sets: 3, reps: 10 }] } : d
    ));
  }

  function handleRemove(id: number) {
    if (!days) return;
    setDays((prev) => prev!.map((d, i) =>
      i === activeDay ? { ...d, exercises: d.exercises.filter((e) => e.exercise.exercise_id !== id) } : d
    ));
  }

  function handleUpdateSets(id: number, sets: number) {
    if (!days) return;
    setDays((prev) => prev!.map((d, i) =>
      i === activeDay ? { ...d, exercises: d.exercises.map((e) => e.exercise.exercise_id === id ? { ...e, sets } : e) } : d
    ));
  }

  function handleUpdateReps(id: number, reps: number) {
    if (!days) return;
    setDays((prev) => prev!.map((d, i) =>
      i === activeDay ? { ...d, exercises: d.exercises.map((e) => e.exercise.exercise_id === id ? { ...e, reps } : e) } : d
    ));
  }

  function handleRenameDay(index: number, label: string) {
    setDays((prev) => prev!.map((d, i) => i === index ? { ...d, label } : d));
  }

  async function handleSave() {
    if (!days || !planName.trim()) return;
    if (!days.every((d) => d.exercises.length > 0)) {
      alert("Every day must have at least one exercise.");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/workouts/create`, {
        name: planName,
        days: days.map((d) => ({
          day_label: d.label,
          exercises: d.exercises.map(({ exercise, sets, reps }) => ({
            exercise_id: exercise.exercise_id, sets, reps,
          })),
        })),
      }, { withCredentials: true });
      setDays(null);
      setPlanName("");
      setActiveTab("plans");
    } catch (err: any) {
      alert(err?.response?.data?.error || "git Failed to save plan");
    }
  }

  const currentDay = days?.[activeDay];
  const addedIds = new Set(currentDay?.exercises.map((e) => e.exercise.exercise_id) ?? []);

  return (
    <div className="min-h-screen bg-[#F7F7FB] px-36 py-8">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-[#72728A] hover:text-black mb-2 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Back to Workouts
        </button>
        <h1 className="text-2xl font-bold text-black">Create Workout Plan</h1>
        <p className="text-sm text-[#72728A] mt-1">Build a multi-day workout plan</p>
      </div>

      <div className={`flex gap-6 items-start ${activeTab === "create" || activeTab === "exercises" ? "justify-center" : ""}`}>
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div className="flex gap-0 border-b border-[#E6E6EE]">
            <button onClick={() => setActiveTab("browse")} className="px-5 py-2.5 text-sm font-medium transition-colors border-b-2"
              style={{ borderColor: activeTab === "browse" ? "#5B5EF4" : "transparent", color: activeTab === "browse" ? "#5B5EF4" : "#72728A" }}>
              Browse Exercises
            </button>
            <button onClick={() => setActiveTab("plans")} className="px-5 py-2.5 text-sm font-medium transition-colors border-b-2"
              style={{ borderColor: activeTab === "plans" ? "#5B5EF4" : "transparent", color: activeTab === "plans" ? "#5B5EF4" : "#72728A" }}>
              My Plans
            </button>
            {isCoach && (
              <>
                <button onClick={() => setActiveTab("create")} className="px-5 py-2.5 text-sm font-medium transition-colors border-b-2"
                  style={{ borderColor: activeTab === "create" ? "#5B5EF4" : "transparent", color: activeTab === "create" ? "#5B5EF4" : "#72728A" }}>
                  Create Exercise
                </button>
                <button onClick={() => setActiveTab("exercises")} className="px-5 py-2.5 text-sm font-medium transition-colors border-b-2"
                  style={{ borderColor: activeTab === "exercises" ? "#5B5EF4" : "transparent", color: activeTab === "exercises" ? "#5B5EF4" : "#72728A" }}>
                  My Exercises
                </button>
              </>
            )}
          </div>

          {activeTab === "browse" && (
            <>
              <div className="flex items-center gap-2 bg-white border border-[#E6E6EE] rounded-xl px-3 py-2.5 focus-within:border-[#5B5EF4] transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="shrink-0">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input placeholder="Search exercises..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm text-black placeholder-[#9CA3AF] outline-none bg-transparent" />
              </div>
              <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {exercises.length === 0 ? (
                  <p className="text-sm text-[#72728A]">No exercises found.</p>
                ) : (
                  exercises.map((exercise) => (
                    <ExerciseCard key={exercise.exercise_id} exercise={exercise} onAdd={handleAdd}
                      isAdded={addedIds.has(exercise.exercise_id)} onPreview={setPreviewExercise} />
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === "plans" && <MyPlans />}
          {activeTab === "create" && isCoach && <CreateExerciseForm />}
          {activeTab === "exercises" && isCoach && <MyExercises />}
        </div>

        {activeTab === "browse" && (
          <div className="w-80 shrink-0 bg-white border border-[#E6E6EE] rounded-2xl p-5 flex flex-col gap-4 sticky top-18">
            {!days ? (
              <DaySetup onConfirm={handleSetupDays} />
            ) : (
              <>
                <DayTabs days={days} activeDay={activeDay} onSelectDay={setActiveDay} onRenameDay={handleRenameDay} />
                <SelectedExerciseList
                  selected={currentDay?.exercises ?? []}
                  onRemove={handleRemove}
                  onUpdateSets={handleUpdateSets}
                  onUpdateReps={handleUpdateReps}
                />
                <div className="border-t border-[#E6E6EE] pt-4">
                  <button onClick={handleSave}
                    className="w-full bg-[#5B5EF4] text-white text-sm font-medium py-2.5 rounded-xl hover:bg-[#4B4EE4] transition-colors">
                    Save Workout Plan
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <ExerciseModal exercise={previewExercise} onClose={() => setPreviewExercise(null)} />
    </div>
  );
}
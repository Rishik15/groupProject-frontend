import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import CategoryFilter from "../../components/CreateWorkoutPlan/CategoryFilter";
import ExerciseCard, {
  type Exercise,
} from "../../components/CreateWorkoutPlan/ExerciseCard";
import SelectedExerciseList, {
  type SelectedExercise,
} from "../../components/CreateWorkoutPlan/SelectedExerciseList";
import PlanSummary from "../../components/CreateWorkoutPlan/PlanSummary";
import { getExercises } from "../../services/workout/getExercises";
import ExerciseModal from "../../components/CreateWorkoutPlan/ExerciseModal";

export default function CreateWorkoutPlan() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<
    SelectedExercise[]
  >([]);
  const [planName, setPlanName] = useState("");
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);

  // fetch exercises from backend on mount
=======
import axios from "axios";
import { useAuth } from "../../utils/auth/AuthContext";
import CategoryFilter from "../../components/CreateWorkoutPlan/CategoryFilter";
import ExerciseCard, { type Exercise } from "../../components/CreateWorkoutPlan/ExerciseCard";
import SelectedExerciseList, { type SelectedExercise } from "../../components/CreateWorkoutPlan/SelectedExerciseList";
import PlanSummary from "../../components/CreateWorkoutPlan/PlanSummary";
import ExerciseModal from "../../components/CreateWorkoutPlan/ExerciseModal";
import MyPlans from "../../components/CreateWorkoutPlan/MyPlans";
import CreateExerciseForm from "../../components/CreateExercises/CreateExerciseForm";
import { getExercises } from "../../services/workout/getExercises";

const BASE_URL = "http://localhost:8080";

export default function CreateWorkoutPlan() {
  const navigate = useNavigate();
const {role } = useAuth();
const isCoach = role === "coach";

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [planName, setPlanName] = useState("");
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);
  const [activeTab, setActiveTab] = useState<"browse" | "plans" | "create">("browse");

>>>>>>> createExercises
  useEffect(() => {
    async function load() {
      const data = await getExercises();
      setExercises(data);
    }
    load();
  }, []);

<<<<<<< HEAD
  // filter exercises by category and search
  const filteredExercises = exercises.filter((ex) => {
    const matchesCategory =
      selectedCategory === "All" || ex.equipment === selectedCategory;
    const matchesSearch = ex.exercise_name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

=======
  const filteredExercises = exercises.filter((ex) => {
    const matchesCategory = selectedCategory === "All" || ex.equipment === selectedCategory;
    const matchesSearch = ex.exercise_name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addedIds = new Set(selectedExercises.map((s) => s.exercise.exercise_id));

>>>>>>> createExercises
  function handleAdd(exercise: Exercise) {
    setSelectedExercises((prev) => [...prev, { exercise, sets: 3, reps: 10 }]);
  }

<<<<<<< HEAD
  const addedIds = new Set(
    selectedExercises.map((s) => s.exercise.exercise_id),
  );
  function handleRemove(id: number) {
    setSelectedExercises((prev) =>
      prev.filter((s) => s.exercise.exercise_id !== id),
    );
=======
  function handleRemove(id: number) {
    setSelectedExercises((prev) => prev.filter((s) => s.exercise.exercise_id !== id));
>>>>>>> createExercises
  }

  function handleUpdateSets(id: number, sets: number) {
    setSelectedExercises((prev) =>
<<<<<<< HEAD
      prev.map((s) => (s.exercise.exercise_id === id ? { ...s, sets } : s)),
=======
      prev.map((s) => (s.exercise.exercise_id === id ? { ...s, sets } : s))
>>>>>>> createExercises
    );
  }

  function handleUpdateReps(id: number, reps: number) {
    setSelectedExercises((prev) =>
<<<<<<< HEAD
      prev.map((s) => (s.exercise.exercise_id === id ? { ...s, reps } : s)),
    );
  }

  function handleSave() {
    // wire up backend call here when route is ready
    // payload:
    // {
    //   name: planName,
    //   exercises: selectedExercises.map(({ exercise, sets, reps }) => ({
    //     exercise_id: exercise.id,
    //     sets,
    //     reps,
    //   }))
    // }
    console.log("saving plan:", { planName, exercises: selectedExercises });
    navigate(-1);
  }

  return (
    <div className="min-h-screen bg-[#F7F7FB] px-8 py-8">
=======
      prev.map((s) => (s.exercise.exercise_id === id ? { ...s, reps } : s))
    );
  }

  async function handleSave() {
    try {
      await axios.post(
        `${BASE_URL}/workouts/create`,
        {
          name: planName,
          exercises: selectedExercises.map(({ exercise, sets, reps }) => ({
            exercise_id: exercise.exercise_id,
            sets,
            reps,
          })),
        },
        { withCredentials: true }
      );
      setSelectedExercises([]);
      setPlanName("");
      setActiveTab("plans");
    } catch (err: any) {
      const message = err?.response?.data?.error || "Failed to save plan";
      alert(message);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7FB] px-36 py-8">
>>>>>>> createExercises
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-[#72728A] hover:text-black mb-2 transition-colors"
          >
<<<<<<< HEAD
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
=======
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
>>>>>>> createExercises
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Workouts
          </button>
          <h1 className="text-2xl font-bold text-black">Create Workout Plan</h1>
<<<<<<< HEAD
          <p className="text-sm text-[#72728A] mt-1">
            Pick exercises and set your sets and reps
          </p>
=======
          <p className="text-sm text-[#72728A] mt-1">Pick exercises and set your sets and reps</p>
>>>>>>> createExercises
        </div>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0 flex flex-col gap-4">
<<<<<<< HEAD
          <div className="flex items-center gap-2 bg-white border border-[#E6E6EE] rounded-xl px-3 py-2.5 focus-within:border-[#5B5EF4] transition-colors">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
              className="shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm text-black placeholder-[#9CA3AF] outline-none bg-transparent"
            />
          </div>

          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredExercises.length === 0 ? (
              <p className="text-sm text-[#72728A]">No exercises found.</p>
            ) : (
              filteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.exercise_id}
                  exercise={exercise}
                  onAdd={handleAdd}
                  isAdded={addedIds.has(exercise.exercise_id)}
                  onPreview={setPreviewExercise}
                />
              ))
            )}
          </div>
        </div>

        <div className="w-80 shrink-0 bg-white border border-[#E6E6EE] rounded-2xl p-5 flex flex-col gap-4 sticky top-6">
          <div>
            <p className="text-base font-semibold text-black">Your Plan</p>
            <p className="text-xs text-[#72728A] mt-0.5">
              {selectedExercises.length} exercise
              {selectedExercises.length !== 1 ? "s" : ""} added
            </p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[60vh]">
=======

          <div className="flex gap-0 border-b border-[#E6E6EE]">
            <button
              onClick={() => setActiveTab("browse")}
              className="px-5 py-2.5 text-sm font-medium transition-colors border-b-2"
              style={{
                borderColor: activeTab === "browse" ? "#5B5EF4" : "transparent",
                color: activeTab === "browse" ? "#5B5EF4" : "#72728A",
              }}
            >
              Browse Exercises
            </button>
            <button
              onClick={() => setActiveTab("plans")}
              className="px-5 py-2.5 text-sm font-medium transition-colors border-b-2"
              style={{
                borderColor: activeTab === "plans" ? "#5B5EF4" : "transparent",
                color: activeTab === "plans" ? "#5B5EF4" : "#72728A",
              }}
            >
              My Plans
            </button>
            {isCoach && (
              <button
                onClick={() => setActiveTab("create")}
                className="px-5 py-2.5 text-sm font-medium transition-colors border-b-2"
                style={{
                  borderColor: activeTab === "create" ? "#5B5EF4" : "transparent",
                  color: activeTab === "create" ? "#5B5EF4" : "#72728A",
                }}
              >
                Create Exercise
              </button>
            )}
          </div>

          {activeTab === "browse" && (
            <>
              <div className="flex items-center gap-2 bg-white border border-[#E6E6EE] rounded-xl px-3 py-2.5 focus-within:border-[#5B5EF4] transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="shrink-0">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  placeholder="Search exercises..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm text-black placeholder-[#9CA3AF] outline-none bg-transparent"
                />
              </div>
              <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredExercises.length === 0 ? (
                  <p className="text-sm text-[#72728A]">No exercises found.</p>
                ) : (
                  filteredExercises.map((exercise) => (
                    <ExerciseCard
                      key={exercise.exercise_id}
                      exercise={exercise}
                      onAdd={handleAdd}
                      isAdded={addedIds.has(exercise.exercise_id)}
                      onPreview={setPreviewExercise}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === "plans" && <MyPlans />}
          {activeTab === "create" && isCoach && <CreateExerciseForm />}
        </div>

        <div className="w-80 shrink-0 bg-white border border-[#E6E6EE] rounded-2xl p-5 flex flex-col gap-4 sticky top-18">
          <div>
            <p className="text-base font-semibold text-black">Your Plan</p>
            <p className="text-xs text-[#72728A] mt-0.5">
              {selectedExercises.length} exercise{selectedExercises.length !== 1 ? "s" : ""} added
            </p>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[45vh]">
>>>>>>> createExercises
            <SelectedExerciseList
              selected={selectedExercises}
              onRemove={handleRemove}
              onUpdateSets={handleUpdateSets}
              onUpdateReps={handleUpdateReps}
            />
          </div>
<<<<<<< HEAD

=======
>>>>>>> createExercises
          <PlanSummary
            selected={selectedExercises}
            planName={planName}
            onPlanNameChange={setPlanName}
            onSave={handleSave}
          />
        </div>
      </div>
<<<<<<< HEAD
=======

>>>>>>> createExercises
      <ExerciseModal
        exercise={previewExercise}
        onClose={() => setPreviewExercise(null)}
      />
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> createExercises

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Pagination } from "@heroui/react";
import { useAuth } from "../../utils/auth/AuthContext";
import CategoryFilter from "../../components/CreateWorkoutPlan/CategoryFilter";
import ExerciseCard, {
  type Exercise,
} from "../../components/CreateWorkoutPlan/ExerciseCard";
import SelectedExerciseList, {
  type SelectedExercise,
} from "../../components/CreateWorkoutPlan/SelectedExerciseList";
import ExerciseModal from "../../components/CreateWorkoutPlan/ExerciseModal";
import MyPlans from "../../components/CreateWorkoutPlan/MyPlans";
import CreateExerciseForm from "../../components/CreateExercises/CreateExerciseForm";
import MyExercises from "../../components/CreateExercises/MyExercises";
import DaySetup from "../../components/CreateWorkoutPlan/DaySetup";
import DayTabs from "../../components/CreateWorkoutPlan/DayTabs";
import CustomModal from "@/components/global/Modal";
import { getExercises } from "../../services/workout/getExercises";

const BASE_URL = "http://localhost:8080";
const ITEMS_PER_PAGE = 6;

interface WorkoutDay {
  label: string;
  exercises: SelectedExercise[];
}

type ActiveTab = "browse" | "plans" | "create" | "exercises";

export default function CreateWorkoutPlan() {
  const navigate = useNavigate();
  const { activeMode } = useAuth();
  const isCoach = activeMode === "coach";

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("browse");

  const [planName, setPlanName] = useState("");
  const [days, setDays] = useState<WorkoutDay[] | null>(null);
  const [activeDay, setActiveDay] = useState(0);

  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    async function load() {
      const equipmentFilter =
        selectedCategory === "All" ? [] : [selectedCategory];

      const data = await getExercises(search, equipmentFilter);
      setExercises(data);
      setPage(1);
    }

    load();
  }, [selectedCategory, search]);

  const totalPages = Math.ceil(exercises.length / ITEMS_PER_PAGE);

  const paginatedExercises = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return exercises.slice(start, start + ITEMS_PER_PAGE);
  }, [exercises, page]);

  const currentDay = days?.[activeDay];

  const addedIds = new Set(
    currentDay?.exercises.map((item) => item.exercise.exercise_id) ?? [],
  );

  const totalSelectedExercises =
    days?.reduce((total, day) => total + day.exercises.length, 0) ?? 0;

  function openModal(title: string, message: string) {
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
  }

  function getPageNumbers() {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (page > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  }

  function handleSetupDays(name: string, dayLabels: string[]) {
    setPlanName(name);
    setDays(dayLabels.map((label) => ({ label, exercises: [] })));
    setActiveDay(0);
  }

  function handleResetPlan() {
    const shouldReset = window.confirm(
      "Are you sure you want to restart this workout plan?",
    );

    if (!shouldReset) return;

    setPlanName("");
    setDays(null);
    setActiveDay(0);
  }

  function handleAdd(exercise: Exercise) {
    if (!days) {
      openModal(
        "Finish setup first",
        "Create your workout plan setup before adding exercises.",
      );
      return;
    }

    setDays((prev) => {
      if (!prev) return prev;

      return prev.map((day, index) => {
        if (index !== activeDay) return day;

        const alreadyAdded = day.exercises.some(
          (item) => item.exercise.exercise_id === exercise.exercise_id,
        );

        if (alreadyAdded) return day;

        return {
          ...day,
          exercises: [...day.exercises, { exercise, sets: 3, reps: 10 }],
        };
      });
    });
  }

  function handleRemove(id: number) {
    setDays((prev) => {
      if (!prev) return prev;

      return prev.map((day, index) =>
        index === activeDay
          ? {
              ...day,
              exercises: day.exercises.filter(
                (item) => item.exercise.exercise_id !== id,
              ),
            }
          : day,
      );
    });
  }

  function handleUpdateSets(id: number, sets: number) {
    const cleanSets = Math.max(1, Math.min(10, sets || 1));

    setDays((prev) => {
      if (!prev) return prev;

      return prev.map((day, index) =>
        index === activeDay
          ? {
              ...day,
              exercises: day.exercises.map((item) =>
                item.exercise.exercise_id === id
                  ? { ...item, sets: cleanSets }
                  : item,
              ),
            }
          : day,
      );
    });
  }

  function handleUpdateReps(id: number, reps: number) {
    const cleanReps = Math.max(1, Math.min(100, reps || 1));

    setDays((prev) => {
      if (!prev) return prev;

      return prev.map((day, index) =>
        index === activeDay
          ? {
              ...day,
              exercises: day.exercises.map((item) =>
                item.exercise.exercise_id === id
                  ? { ...item, reps: cleanReps }
                  : item,
              ),
            }
          : day,
      );
    });
  }

  function handleRenameDay(index: number, label: string) {
    setDays((prev) => {
      if (!prev) return prev;

      return prev.map((day, i) => (i === index ? { ...day, label } : day));
    });
  }

  async function handleSave() {
    if (!days || !planName.trim()) {
      openModal(
        "Workout plan not ready",
        "Please finish setting up your workout plan before saving.",
      );
      return;
    }

    const hasEmptyDayName = days.some((day) => !day.label.trim());

    if (hasEmptyDayName) {
      openModal("Missing day name", "Every workout day needs a name.");
      return;
    }

    const hasNoExercisesAtAll = days.every((day) => day.exercises.length === 0);

    if (hasNoExercisesAtAll) {
      openModal(
        "No exercises added",
        "Add at least one exercise before saving the workout plan.",
      );
      return;
    }

    const emptyDays = days
      .map((day, index) => ({
        label: day.label.trim() || `Day ${index + 1}`,
        isEmpty: day.exercises.length === 0,
      }))
      .filter((day) => day.isEmpty);

    if (emptyDays.length > 0) {
      openModal(
        "Some days are empty",
        `These days have no exercises: ${emptyDays
          .map((day) => day.label)
          .join(
            ", ",
          )}. Add exercises to them or reset the plan with fewer days.`,
      );
      return;
    }

    try {
      setSaving(true);

      await axios.post(
        `${BASE_URL}/workouts/create`,
        {
          name: planName,
          days: days.map((day, index) => ({
            day_number: index + 1,
            day_label: day.label.trim(),
            exercises: day.exercises.map(({ exercise, sets, reps }, order) => ({
              exercise_id: exercise.exercise_id,
              sets,
              reps,
              exercise_order: order + 1,
            })),
          })),
        },
        { withCredentials: true },
      );

      setDays(null);
      setPlanName("");
      setActiveDay(0);
      setActiveTab("plans");
    } catch (err: any) {
      const message = err?.response?.data?.error || "Failed to save plan";
      openModal("Save failed", message);
    } finally {
      setSaving(false);
    }
  }

  const startItem =
    exercises.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;

  const endItem = Math.min(page * ITEMS_PER_PAGE, exercises.length);

  return (
    <div className="px-36 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[#72728A] hover:text-black mb-2 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Workouts
        </button>

        <h1 className="text-2xl font-bold text-black">Create Workout Plan</h1>

        <p className="text-sm text-[#72728A] mt-1">
          Build a multi-day workout plan
        </p>
      </div>

      <div
        className={`flex gap-6 items-start ${
          activeTab === "create" || activeTab === "exercises"
            ? "justify-center"
            : ""
        }`}
      >
        <div className="flex-1 min-w-0 flex flex-col gap-4">
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
              <>
                <button
                  onClick={() => setActiveTab("create")}
                  className="px-5 py-2.5 text-sm font-medium transition-colors border-b-2"
                  style={{
                    borderColor:
                      activeTab === "create" ? "#5B5EF4" : "transparent",
                    color: activeTab === "create" ? "#5B5EF4" : "#72728A",
                  }}
                >
                  Create Exercise
                </button>

                <button
                  onClick={() => setActiveTab("exercises")}
                  className="px-5 py-2.5 text-sm font-medium transition-colors border-b-2"
                  style={{
                    borderColor:
                      activeTab === "exercises" ? "#5B5EF4" : "transparent",
                    color: activeTab === "exercises" ? "#5B5EF4" : "#72728A",
                  }}
                >
                  My Exercises
                </button>
              </>
            )}
          </div>

          {activeTab === "browse" && (
            <>
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
                {exercises.length === 0 ? (
                  <p className="text-sm text-[#72728A]">No exercises found.</p>
                ) : (
                  paginatedExercises.map((exercise) => (
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

              {totalPages > 1 && (
                <Pagination className="w-full pt-2" size="sm">
                  <Pagination.Summary>
                    Showing {startItem}-{endItem} of {exercises.length}{" "}
                    exercises
                  </Pagination.Summary>

                  <Pagination.Content>
                    <Pagination.Item>
                      <Pagination.Previous
                        isDisabled={page === 1}
                        onPress={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        <Pagination.PreviousIcon />
                        <span>Previous</span>
                      </Pagination.Previous>
                    </Pagination.Item>

                    {getPageNumbers().map((p, index) =>
                      p === "ellipsis" ? (
                        <Pagination.Item key={`ellipsis-${index}`}>
                          <Pagination.Ellipsis />
                        </Pagination.Item>
                      ) : (
                        <Pagination.Item key={p}>
                          <Pagination.Link
                            isActive={p === page}
                            onPress={() => setPage(p)}
                          >
                            {p}
                          </Pagination.Link>
                        </Pagination.Item>
                      ),
                    )}

                    <Pagination.Item>
                      <Pagination.Next
                        isDisabled={page === totalPages}
                        onPress={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                      >
                        <span>Next</span>
                        <Pagination.NextIcon />
                      </Pagination.Next>
                    </Pagination.Item>
                  </Pagination.Content>
                </Pagination>
              )}
            </>
          )}

          {activeTab === "plans" && <MyPlans />}

          {activeTab === "create" && isCoach && <CreateExerciseForm />}

          {activeTab === "exercises" && isCoach && (
            <>
              <div>
                <h1 className="text-2xl font-bold text-black">
                  Created Exercises
                </h1>
                <p className="text-sm text-[#72728A] mt-1">
                  Repository of all created exercises.
                </p>
              </div>

              <MyExercises />
            </>
          )}
        </div>

        {activeTab === "browse" && (
          <div className="w-80 shrink-0 bg-white border border-[#E6E6EE] rounded-2xl p-5 flex flex-col gap-4 sticky top-18 mt-14.5">
            {!days ? (
              <DaySetup onConfirm={handleSetupDays} />
            ) : (
              <>
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-black">
                        {planName}
                      </p>
                      <p className="text-xs text-[#72728A] mt-0.5">
                        {totalSelectedExercises} exercise
                        {totalSelectedExercises !== 1 ? "s" : ""} added
                      </p>
                    </div>

                    <button
                      onClick={handleResetPlan}
                      className="text-xs text-[#72728A] hover:text-red-500 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <DayTabs
                  days={days}
                  activeDay={activeDay}
                  onSelectDay={setActiveDay}
                  onRenameDay={handleRenameDay}
                />

                <div className="flex-1 overflow-y-auto max-h-[25vh] pr-1">
                  <SelectedExerciseList
                    selected={currentDay?.exercises ?? []}
                    activeDayLabel={currentDay?.label || "this day"}
                    onRemove={handleRemove}
                    onUpdateSets={handleUpdateSets}
                    onUpdateReps={handleUpdateReps}
                  />
                </div>

                <div className="border-t border-[#E6E6EE] pt-4">
                  <Button
                    fullWidth
                    isPending={saving}
                    isDisabled={saving}
                    onPress={handleSave}
                    className="bg-[#5B5EF4] text-white text-sm font-medium rounded-xl hover:bg-[#4B4EE4]"
                  >
                    {saving ? "Saving..." : "Save Workout Plan"}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <ExerciseModal
        exercise={previewExercise}
        onClose={() => setPreviewExercise(null)}
      />

      <CustomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
      >
        {modalMessage}
      </CustomModal>
    </div>
  );
}

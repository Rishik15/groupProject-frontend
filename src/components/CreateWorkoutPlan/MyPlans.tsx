import { useState, useEffect } from "react";
import {
  getMyPlans,
  getPlanExercises,
  type PlanDay,
} from "../../services/workout/getMyPlans";

export interface WorkoutPlan {
  plan_id: number;
  plan_name: string;
  description: string;
  source: "authored" | "assigned";
  total_exercises: number;
}

function PlanCard({ plan }: { plan: WorkoutPlan }) {
  const [expanded, setExpanded] = useState(false);
  const [days, setDays] = useState<PlanDay[]>([]);
  const [loadingDays, setLoadingDays] = useState(false);

  async function handleExpand() {
    if (!expanded && days.length === 0) {
      setLoadingDays(true);

      try {
        const data = await getPlanExercises(plan.plan_id);
        setDays(data);
      } catch {
        setDays([]);
      } finally {
        setLoadingDays(false);
      }
    }

    setExpanded((value) => !value);
  }

  return (
    <div
      className="bg-white border rounded-2xl overflow-hidden transition-all"
      style={{
        borderColor: expanded ? "#5B5EF4" : "#E6E6EE",
        borderWidth: "0.5px",
      }}
    >
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-black">{plan.plan_name}</p>

          <p className="text-xs text-[#72728A] mt-1">
            {plan.total_exercises} exercise
            {plan.total_exercises !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5B5EF4] bg-[#5B5EF4]/10 px-3 py-0.5 rounded-full capitalize">
            {plan.source === "authored" ? "Created" : "Assigned"}
          </span>

          <button
            onClick={handleExpand}
            className="text-xs border rounded-lg px-3 py-1 transition-colors min-w-[64px] text-center"
            style={{
              borderColor: expanded ? "#5B5EF4" : "#E6E6EE",
              color: expanded ? "#5B5EF4" : "#72728A",
            }}
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#E6E6EE] px-5 py-3 flex flex-col gap-4">
          {loadingDays ? (
            <div className="flex flex-col gap-2">
              <div className="h-3 w-full rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-3/4 rounded bg-gray-200 animate-pulse" />
            </div>
          ) : days.length === 0 ? (
            <p className="text-xs text-[#72728A]">
              No exercises found for this plan.
            </p>
          ) : (
            days.map((day) => (
              <div key={day.day_id} className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-[#5B5EF4]">
                  {day.day_label}
                </p>

                {day.exercises.length === 0 ? (
                  <p className="text-xs text-[#72728A] pl-4">
                    No exercises added.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2 pl-4">
                    {day.exercises.map((exercise) => (
                      <div
                        key={`${day.day_id}-${exercise.exercise_id}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-[#72728A] mt-0.5">•</span>

                          <div>
                            <p className="text-black">
                              {exercise.exercise_name}
                            </p>

                            {exercise.equipment && (
                              <p className="text-xs text-[#72728A]">
                                {exercise.equipment}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="text-[#72728A] shrink-0">
                          {exercise.sets_goal} sets × {exercise.reps_goal} reps
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function MyPlans() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyPlans();
        setPlans(data);
      } catch {
        setPlans([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="bg-white border border-[#E6E6EE] rounded-2xl p-5"
          >
            <div className="h-4 w-40 rounded bg-gray-200 animate-pulse mb-2" />
            <div className="h-3 w-20 rounded bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-[#5B5EF4]/10 flex items-center justify-center mb-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5B5EF4"
            strokeWidth="2"
          >
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
          </svg>
        </div>

        <p className="text-sm font-medium text-black">No plans yet</p>

        <p className="text-xs text-[#72728A] mt-1">
          Create your first workout plan above.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {plans.map((plan) => (
        <PlanCard key={plan.plan_id} plan={plan} />
      ))}
    </div>
  );
}

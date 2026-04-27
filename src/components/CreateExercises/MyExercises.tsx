import { useState, useEffect } from "react";
import type { Exercise } from "../CreateWorkoutPlan/ExerciseCard";
import { getCreatedExercises } from "../../services/workout/getCreatedExercise";

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [expanded, setExpanded] = useState(false);
  console.log("video_url: ", exercise.video_url);
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
          <p className="text-sm font-semibold text-black">
            {exercise.exercise_name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded((x) => !x)}
            className="text-xs border rounded-lg px-3 py-1 transition-colors"
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
        <div className="text-xs border-t border-[#E6E6EE] px-5 py-3 flex flex-col gap-2">
          <p className="font-semibold">Nessecary Equipment:</p>
          {exercise.equipment}
          <div></div>
          <p className="text-xs font-semibold">Description:</p>
          {exercise.description}
          {exercise.video_url ? (
            <video
              src={`http://localhost:8080${exercise.video_url}`}
              controls
              className="w-full rounded-xl"
            />
          ) : (
            <p className="text-xs text-[#72728A]">No video available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  useEffect(() => {
    async function load() {
      const data = await getCreatedExercises();
      setExercises(data);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.exercise_id} exercise={exercise} />
      ))}
    </div>
  );
}

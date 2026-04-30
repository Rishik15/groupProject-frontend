import { useState, useEffect, useMemo } from "react";
import { Pagination } from "@heroui/react";
import type { Exercise } from "../CreateWorkoutPlan/ExerciseCard";
import { getCreatedExercises } from "../../services/workout/getCreatedExercise";

const ITEMS_PER_PAGE = 5;

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [expanded, setExpanded] = useState(false);

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
          <p className="text-xs text-[#72728A] mt-1">{exercise.equipment}</p>
        </div>

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

      {expanded && (
        <div className="text-xs border-t border-[#E6E6EE] px-5 py-3 flex flex-col gap-2">
          <p className="font-semibold text-black">Necessary Equipment:</p>
          <p className="text-[#72728A]">{exercise.equipment}</p>

          <p className="font-semibold text-black mt-2">Description:</p>
          <p className="text-[#72728A]">{exercise.description}</p>

          {exercise.video_url ? (
            <video
              src={`http://localhost:8080${exercise.video_url}`}
              controls
              className="w-full rounded-xl mt-2"
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
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCreatedExercises();
        setExercises(data);
      } catch {
        setExercises([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const totalPages = Math.ceil(exercises.length / ITEMS_PER_PAGE);

  const paginatedExercises = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return exercises.slice(start, start + ITEMS_PER_PAGE);
  }, [exercises, page]);

  const startItem =
    exercises.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;

  const endItem = Math.min(page * ITEMS_PER_PAGE, exercises.length);

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

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#E6E6EE] rounded-2xl p-5"
          >
            <div className="h-4 w-40 rounded bg-gray-200 animate-pulse mb-2" />
            <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-black">No exercises yet</p>
        <p className="text-xs text-[#72728A] mt-1">
          Created exercises will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {paginatedExercises.map((exercise) => (
          <ExerciseCard key={exercise.exercise_id} exercise={exercise} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="w-full pt-2" size="sm">
          <Pagination.Summary>
            Showing {startItem}-{endItem} of {exercises.length} exercises
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
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <span>Next</span>
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      )}
    </div>
  );
}

import { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

interface Props {
  mealPlanId: number;
  planName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignModal({
  mealPlanId,
  planName,
  onClose,
  onSuccess,
}: Props) {
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [conflict, setConflict] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleAssign(force = false) {
    if (!startDate) {
      setError("Please select a date.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/nutrition/meal-plans/assign`,
        { meal_plan_id: mealPlanId, start_date: startDate, force },
        { withCredentials: true },
      );
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      err?.response?.status === 409
        ? setConflict(err.response.data.existing_plan_name)
        : setError("Failed to assign plan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-black">Assign Plan</p>
          <button onClick={onClose} className="text-[#72728A] hover:text-black">
            ✕
          </button>
        </div>

        <p className="text-xs text-[#72728A]">
          Assigning <span className="font-medium text-black">{planName}</span>.
          Pick a Monday to start.
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3 text-center">
            ✓ Plan assigned successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {conflict ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-xl px-4 py-3">
            <p>
              <span className="font-medium">"{conflict}"</span> is already
              assigned for this week. Please choose a different week.
            </p>
            <button
              onClick={() => setConflict(null)}
              className="mt-3 w-full border border-yellow-300 text-yellow-700 text-xs font-medium py-2 rounded-xl"
            >
              OK
            </button>
          </div>
        ) : (
          !success && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-sm border border-[#E6E6EE] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5B5EF4]"
              />
              <button
                onClick={() => handleAssign(false)}
                disabled={loading}
                className="w-full bg-[#5B5EF4] text-white text-sm font-medium py-2.5 rounded-xl hover:bg-[#4B4EE4] disabled:opacity-50"
              >
                {loading ? "Assigning..." : "Assign Plan"}
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
}

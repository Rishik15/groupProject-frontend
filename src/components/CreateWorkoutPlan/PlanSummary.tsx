import type { SelectedExercise } from "./SelectedExerciseList";

interface PlanSummaryProps {
  selected: SelectedExercise[];
  planName: string;
  onPlanNameChange: (name: string) => void;
  assignDate: string;
  onAssignDateChange: (date: string) => void;
  onSave: () => void;
}
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PlanSummary({ selected, planName, onPlanNameChange, assignDate, onAssignDateChange, onSave }: PlanSummaryProps) {
  return (
    <div className="border-t border-[#E6E6EE] pt-4 flex flex-col gap-3">
      <input
        type="text"
        placeholder="Name your workout plan..."
        value={planName}
        onChange={(e) => onPlanNameChange(e.target.value)}
        className="w-full text-sm border border-[#E6E6EE] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5B5EF4] transition-colors"
      />
      <select
        value={assignDate}
        onChange={(e) => onAssignDateChange(e.target.value)}
        className="w-full text-sm border border-[#E6E6EE] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5B5EF4] transition-colors bg-white"
      >
        <option>Assign to any day</option>
        {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <button
        onClick={onSave}
        disabled={selected.length === 0 || !planName.trim()}
        className="w-full bg-[#5B5EF4] text-white text-sm font-medium py-2.5 rounded-xl hover:bg-[#4B4EE4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Save Workout Plan ({selected.length} exercise{selected.length !== 1 ? "s" : ""})
      </button>
    </div>
  );
}
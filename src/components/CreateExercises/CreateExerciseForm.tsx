import { useState } from "react";
import { createExercise } from "../../services/workout/createExercise";

const EQUIPMENT_OPTIONS = [
  "Barbell", "Dumbbell", "Kettlebell", "Machine", "Cable",
  "Bodyweight", "Resistance Band", "Smith Machine", "Sled Machine", "Treadmill", "Other",
];

export default function CreateExerciseForm() {
  const [name, setName] = useState("");
  const [equipment, setEquipment] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!name.trim() || !equipment || !description.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createExercise({ name, equipment, description });
      setSuccess(true);
      setName("");
      setEquipment("");
      setDescription("");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create exercise.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div>
        <p className="text-base font-semibold text-black">Create New Exercise</p>
        <p className="text-xs text-[#72728A] mt-0.5">
          Add a new exercise to the platform for all users to see
        </p>
      </div>


      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3">
          Exercise created successfully! It is now available in the browse list.
        </div>
      )}

  
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}


      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#72728A] uppercase tracking-wider">
          Exercise Name
        </label>
        <input
          type="text"
          placeholder="e.g. Bulgarian Split Squat"
          value={name}
          onChange={(e) => { setName(e.target.value); setSuccess(false); }}
          className="w-full text-sm border border-[#E6E6EE] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5B5EF4] transition-colors"
        />
      </div>

      
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#72728A] uppercase tracking-wider">
          Equipment
        </label>
        <select
          value={equipment}
          onChange={(e) => { setEquipment(e.target.value); setSuccess(false); }}
          className="w-full text-sm border border-[#E6E6EE] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5B5EF4] transition-colors bg-white"
        >
          <option value="">Select equipment...</option>
          {EQUIPMENT_OPTIONS.map((eq) => (
            <option key={eq} value={eq}>{eq}</option>
          ))}
        </select>
      </div>

    
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#72728A] uppercase tracking-wider">
          Description
        </label>
        <textarea
          placeholder="Describe how to perform this exercise..."
          value={description}
          onChange={(e) => { setDescription(e.target.value); setSuccess(false); }}
          rows={4}
          className="w-full text-sm border border-[#E6E6EE] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5B5EF4] transition-colors resize-none"
        />
      </div>

      
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-[#5B5EF4] text-white text-sm font-medium py-2.5 rounded-xl hover:bg-[#4B4EE4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create Exercise"}
      </button>
    </div>
  );
}
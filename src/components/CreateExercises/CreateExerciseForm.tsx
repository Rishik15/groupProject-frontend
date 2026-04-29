import { useState } from "react";
import { createExercise } from "../../services/workout/createExercise";

const EQUIPMENT_OPTIONS = [
  "Barbell",
  "Dumbbell",
  "Kettlebell",
  "Machine",
  "Cable",
  "Bodyweight",
  "Resistance Band",
  "Smith Machine",
  "Sled Machine",
  "Treadmill",
  "Other",
];

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#72728A] uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CreateExerciseForm() {
  const [name, setName] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!name.trim() || equipment.length === 0 || !description.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("equipment", equipment.join(", "));
      formData.append("description", description);
      if (video) formData.append("video", video);
      await createExercise(formData);
      setSuccess(true);
      setName("");
      setEquipment([]);
      setDescription("");
      setVideo(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create exercise.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full text-sm border border-[#E6E6EE] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5B5EF4] transition-colors";

  return (
    <div className="flex flex-col gap-6 max-w-2xl w-full mx-auto py-3">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3">
          Exercise created successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <FormField label="Exercise Name">
        <input
          type="text"
          placeholder="e.g. Bulgarian Split Squat"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSuccess(false);
          }}
          className={inputClass}
        />
      </FormField>

      <FormField label="Equipment">
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((eq) => {
            const active = equipment.includes(eq);
            return (
              <button
                key={eq}
                type="button"
                onClick={() => {
                  setEquipment((prev) =>
                    active ? prev.filter((e) => e !== eq) : [...prev, eq],
                  );
                  setSuccess(false);
                }}
                className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors"
                style={{
                  backgroundColor: active ? "#5B5EF4" : "transparent",
                  color: active ? "#ffffff" : "#72728A",
                  borderColor: active ? "#5B5EF4" : "#E6E6EE",
                }}
              >
                {eq}
              </button>
            );
          })}
        </div>
      </FormField>

      <FormField label="Description">
        <textarea
          placeholder="Describe how to perform this exercise..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setSuccess(false);
          }}
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </FormField>

      <FormField label="Exercise Video (optional)">
        <div
          className="w-full border border-dashed border-[#E6E6EE] rounded-xl px-4 py-3 flex flex-col items-center gap-2 cursor-pointer hover:border-[#5B5EF4] transition-colors"
          onClick={() => document.getElementById("video-upload")?.click()}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="1.5"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-sm text-[#72728A]">
            {video ? video.name : "Click to upload a video"}
          </p>
          <p className="text-xs text-[#72728A]">MP4</p>
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => setVideo(e.target.files?.[0] ?? null)}
          />
        </div>
        {video && (
          <button
            onClick={() => setVideo(null)}
            className="text-xs text-red-400 hover:text-red-600 self-start"
          >
            Remove video
          </button>
        )}
      </FormField>

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

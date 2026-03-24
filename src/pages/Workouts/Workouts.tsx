import { useState } from "react";
import WorkoutLogModal from "../../components/WorkoutLog/Modal";

export default function Workouts() {
    const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);

    return (
        <main className="min-h-screen bg-white p-8">
            <h1 className="mb-6 text-3xl font-bold text-black">Workouts Test Page</h1>

            <button
                type="button"
                className="rounded-2xl bg-blue-600 px-8 py-4 text-2xl font-semibold text-white"
                onClick={() => setIsWorkoutModalOpen(true)}
            >
                + Add Session
            </button>

            <WorkoutLogModal
                isOpen={isWorkoutModalOpen}
                onOpenChange={setIsWorkoutModalOpen}
            />
        </main>
    );
}

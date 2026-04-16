import WorkoutScheduleSection from "../../components/WorkoutSchedule/WorkoutScheduleSection";

export default function Workouts() {
    return (
        <main className="min-h-screen bg-white px-8 py-8">
            <div className="mx-auto w-full max-w-[1400px] space-y-6">
                <div>
                    <p className="text-[11.25px] font-medium text-[#72728A]">
                        Workout Tracker
                    </p>

                    <h1 className="mt-1 text-[18.75px] font-semibold text-[#0F0F14]">
                        Workouts
                    </h1>

                    <p className="mt-2 max-w-3xl text-[11.25px] text-[#72728A]">
                        View your weekly workout schedule, add session blocks to the
                        calendar, and open the workout logger for completed strength
                        sets or cardio activity.
                    </p>
                </div>

                <WorkoutScheduleSection />
            </div>
        </main>
    );
}
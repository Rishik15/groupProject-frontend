import { Card } from "@heroui/react";
import {
    Dumbbell
} from "lucide-react";
import WorkoutManagementTab from "../../components/Admin/Workouts/WorkoutManagementTab";

const Workouts = () => {
    return (
        <div>
            <div className="px-36 border-b border-neutral-200 bg-white">
                <div className="space-y-3 p-3">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        Workout management
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-default-600">
                        Manage workout plans and templates from one fixed admin page.
                    </p>
                </div>
            </div>
            <div className="min-h-[calc(100vh-56px)] bg-default-50 px-36 py-8">
                <div className="space-y-6">
                    <WorkoutManagementTab />
                </div>
            </div>
        </div>
    );
};

export default Workouts;
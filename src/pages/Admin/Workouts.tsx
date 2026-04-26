import { Card } from "@heroui/react";
import {
    Dumbbell
} from "lucide-react";
import WorkoutManagementTab from "../../components/Admin/Workouts/WorkoutManagementTab";

const Workouts = () => {
    return (
        <div className="min-h-[calc(100vh-56px)] bg-default-50 px-36 py-8">
            <div className="space-y-6">
                <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-6 p-6">
                        <div className="space-y-3">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-default-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-default-700">
                                <Dumbbell className="h-4 w-4" />
                                Workouts
                            </div>

                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-default-900">
                                    Workout management
                                </h1>
                                <p className="mt-2 max-w-3xl text-sm text-default-600">
                                    Manage workout plans and templates from one fixed admin page.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <WorkoutManagementTab />
            </div>
        </div>
    );
};

export default Workouts;
import { Button } from "@heroui/react";
import { Award } from "lucide-react";
import type { WorkoutPlan } from "./types";

type Props = {
    plans: WorkoutPlan[];
    onBack: () => void;
};

export function PlanResults({ plans, onBack }: Props) {
    return (
        <div className="w-full max-w-6xl p-6">
            <Button
                onClick={onBack}
                className="mb-4 p-0 h-auto min-h-0 text-sm text-gray-500 hover:text-black justify-start"
            >
                ← Back
            </Button>

            <h1 className="text-xl font-medium">Recommended Workout Plans</h1>
            <p className="mb-8 text-md text-gray-500">
                Based on your goals and preferences
            </p>

            <div className="grid gap-4">
                {plans.map((plan) => (
                    <div
                        key={plan.plan_id}
                        className="rounded-2xl border bg-white p-6 shadow-sm hover:border-indigo-500"
                    >
                        <div className="grid grid-cols-2">
                            <h2 className="text-xl font-semibold">{plan.plan_name}</h2>

                            <div className="flex justify-end">
                                <Button className="rounded-lg bg-indigo-500 text-white">
                                    <Award className="mr-2 h-4 w-4" />
                                    <span>Assign Plan</span>
                                </Button>
                            </div>
                        </div>

                        <p className="mt-1 text-gray-500">{plan.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
import { Button, Card } from "@heroui/react";
import {
    ClipboardList,
    Dumbbell,
    Home,
    ShieldCheck,
    UserCog,
    Wrench,
} from "lucide-react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import WorkoutManagementTab from "../../components/Admin/Workouts/WorkoutManagementTab";

const Workouts = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const managementPath = "/admin/workouts/workout-management";
    const managementIsActive =
        location.pathname === "/admin/workouts" ||
        location.pathname === managementPath;

    const pageLinks = [
        { label: "Dashboard", icon: Home, path: "/admin" },
        { label: "Accounts", icon: UserCog, path: "/admin/accounts" },
        {
            label: "Coach Governance",
            icon: ShieldCheck,
            path: "/admin/coach-governance",
        },
        { label: "Reports", icon: ClipboardList, path: "/admin/reports" },
        { label: "Exercises", icon: Wrench, path: "/admin/exercises" },
    ];

    return (
        <div className="min-h-[calc(100vh-56px)] bg-default-50 px-36 py-8">
            <div className="space-y-6">
                <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-6 p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-2">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-default-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-default-700">
                                    <Dumbbell className="h-4 w-4" />
                                    Workouts
                                </div>

                                <div>
                                    <h1 className="text-3xl font-semibold tracking-tight text-default-900">
                                        Workout plan management
                                    </h1>
                                    <p className="mt-2 max-w-3xl text-sm text-default-600">
                                        Manage workout plans and templates, edit metadata, and update day 1 exercises using the admin workout endpoints already available on the backend.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-default-500">
                                    Temporary navigation
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {pageLinks.map((link) => {
                                        const Icon = link.icon;
                                        return (
                                            <Button className={"bg-[#5B5EF4]"} key={link.path} onPress={() => navigate(link.path)}>
                                                <span className="inline-flex items-center gap-2">
                                                    <Icon className="h-4 w-4" />
                                                    {link.label}
                                                </span>
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => navigate(managementPath)}
                                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${managementIsActive
                                    ? "border-default-900 bg-[#5B5EF4] text-white"
                                    : "border-default-200 bg-white text-default-700 hover:border-default-300"
                                    }`}
                            >
                                Workout Management
                            </button>
                        </div>
                    </div>
                </Card>

                <Routes>
                    <Route index element={<Navigate to="workout-management" replace />} />
                    <Route path="workout-management" element={<WorkoutManagementTab />} />
                    <Route path="*" element={<Navigate to="workout-management" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default Workouts;

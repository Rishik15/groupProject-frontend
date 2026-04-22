import { Button, Card } from "@heroui/react";
import {
    ClipboardList,
    PlaySquare,
    ShieldCheck,
} from "lucide-react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ExerciseManagementTab from "../../components/Admin/Exercises/ExerciseManagementTab";
import VideoModerationTab from "../../components/Admin/Exercises/VideoModerationTab";

type ExercisesTab = {
    key: "management" | "video-moderation";
    label: string;
    path: string;
    icon: typeof ClipboardList;
    description: string;
};

const exerciseTabs: ExercisesTab[] = [
    {
        key: "management",
        label: "Exercise Management",
        path: "/admin/exercises/management",
        icon: ClipboardList,
        description:
            "Create, edit, search, and remove exercises using the live admin exercise CRUD endpoints.",
    },
    {
        key: "video-moderation",
        label: "Video Moderation",
        path: "/admin/exercises/video-moderation",
        icon: PlaySquare,
        description:
            "Review pending exercise videos and approve, reject, or remove clips from the moderation queue.",
    },
];

const Exercises = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const currentTab =
        exerciseTabs.find((tab) => location.pathname.startsWith(tab.path)) ??
        exerciseTabs[0];

    return (
        <div className="min-h-[calc(100vh-56px)] bg-default-50 px-36 py-8">
            <div className="space-y-6">
                <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-6 p-6 xl:flex-row xl:items-start xl:justify-between">
                        <div className="space-y-3">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-default-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-default-700">
                                <ShieldCheck className="h-4 w-4" />
                                Exercises
                            </div>

                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-default-900">
                                    Exercise database and video review
                                </h1>
                                <p className="mt-2 max-w-3xl text-sm text-default-600">
                                    This wrapper page owns both exercise CRUD and pending video moderation.
                                    The backend routes for these features are already live, so this page can
                                    be fully wired now. The temporary buttons below let you move between
                                    admin wrapper pages until the shared navbar is built.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
                                Exercise tabs
                            </p>
                            <p className="mt-1 text-sm text-default-600">{currentTab.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {exerciseTabs.map((tab) => {
                                const Icon = tab.icon;
                                const active = currentTab.key === tab.key;

                                return (
                                    <Button
                                        key={tab.key}
                                        onPress={() => navigate(tab.path)}
                                        className={active ? "border border-default-300" : undefined}
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <Icon className="h-4 w-4" />
                                            {tab.label}
                                        </span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </Card>

                <Routes>
                    <Route index element={<Navigate to="management" replace />} />
                    <Route path="management" element={<ExerciseManagementTab />} />
                    <Route path="video-moderation" element={<VideoModerationTab />} />
                    <Route path="*" element={<Navigate to="management" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default Exercises;

import { useMemo, useState } from "react";
import { Button, Card } from "@heroui/react";
import {
    ArrowLeft,
    Search,
    Video,
    TriangleAlert,
    CircleCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type ExerciseReviewStatus = "pending" | "approved" | "flagged";

interface AdminExerciseItem {
    id: number;
    name: string;
    category: string;
    muscleGroup: string;
    videoUrl: string;
    thumbnailUrl?: string;
    status: ExerciseReviewStatus;
    notes?: string;
}

const placeholderExercises: AdminExerciseItem[] = [
    {
        id: 1,
        name: "Barbell Back Squat",
        category: "Strength",
        muscleGroup: "Legs",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        status: "pending",
    },
    {
        id: 2,
        name: "Lat Pulldown",
        category: "Machine",
        muscleGroup: "Back",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        status: "approved",
    },
    {
        id: 3,
        name: "Cable Lateral Raise",
        category: "Isolation",
        muscleGroup: "Shoulders",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        status: "flagged",
        notes: "Check camera angle / unclear form demo",
    },
];

const statusClasses: Record<ExerciseReviewStatus, string> = {
    pending: "bg-[#FFF7E8] text-[#B7791F]",
    approved: "bg-[#ECFDF3] text-[#027A48]",
    flagged: "bg-[#FEF3F2] text-[#D92D20]",
};

const Exercises = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [exercises, setExercises] =
        useState<AdminExerciseItem[]>(placeholderExercises);

    const filteredExercises = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) return exercises;

        return exercises.filter((exercise) => {
            return (
                exercise.name.toLowerCase().includes(normalizedQuery) ||
                exercise.category.toLowerCase().includes(normalizedQuery) ||
                exercise.muscleGroup.toLowerCase().includes(normalizedQuery)
            );
        });
    }, [exercises, query]);

    const updateStatus = (exerciseId: number, status: ExerciseReviewStatus) => {
        setExercises((current) =>
            current.map((exercise) =>
                exercise.id === exerciseId ? { ...exercise, status } : exercise,
            ),
        );
    };

    return (
        <div className="min-h-screen bg-default-50">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex max-w-7xl flex-col gap-[18px] px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primary/8 p-2">
                            <Video className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>

                        <div>
                            <h1 className="font-semibold leading-none text-[18.75px] text-[#0F0F14]">
                                Exercise Review
                            </h1>
                            <p className="mt-0.5 leading-normal text-[13.125px] text-[#72728A]">
                                Review exercise videos and approve content quality
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={() => navigate("/admin")}
                        className="h-[42px] rounded-[13.5px] border border-[#DCDCF4] bg-white px-[18px] text-[13.125px] font-medium leading-[18px] text-[#0F0F14]"
                    >
                        <span className="inline-flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to dashboard
                        </span>
                    </Button>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full max-w-[360px]">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-default-400" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search exercises..."
                            className="h-[46px] w-full rounded-[13.5px] border border-[#DCDCF4] bg-white pl-11 pr-4 text-[13.125px] text-[#0F0F14] outline-none transition-colors placeholder:text-default-400 focus:border-primary"
                        />
                    </div>

                    <div className="text-[13.125px] text-[#72728A]">
                        {filteredExercises.length} exercise
                        {filteredExercises.length === 1 ? "" : "s"}
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredExercises.map((exercise) => (
                        <Card
                            key={exercise.id}
                            className="rounded-[20px] border border-[#DCDCF4] bg-white shadow-none"
                        >
                            <div className="grid gap-5 p-[22.5px] lg:grid-cols-[320px_minmax(0,1fr)]">
                                <div className="overflow-hidden rounded-[16px] border border-[#E6E6F0] bg-black">
                                    <video
                                        controls
                                        className="h-[220px] w-full object-cover"
                                        src={exercise.videoUrl}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div className="min-w-0">
                                            <p className="truncate text-[18.75px] font-semibold leading-[24px] text-[#0F0F14]">
                                                {exercise.name}
                                            </p>
                                            <p className="mt-1 text-[13.125px] leading-[18px] text-[#72728A]">
                                                {exercise.category} · {exercise.muscleGroup}
                                            </p>
                                        </div>

                                        <span
                                            className={`inline-flex w-fit items-center justify-center rounded-[11.25px] px-[13.5px] py-[7.5px] text-[13.125px] font-medium leading-none ${statusClasses[exercise.status]}`}
                                        >
                                            {exercise.status.charAt(0).toUpperCase() +
                                                exercise.status.slice(1)}
                                        </span>
                                    </div>

                                    {exercise.notes ? (
                                        <div className="mt-4 rounded-[13.5px] bg-[#F8F8FC] px-4 py-3">
                                            <p className="text-[13.125px] leading-[18px] text-[#72728A]">
                                                {exercise.notes}
                                            </p>
                                        </div>
                                    ) : null}

                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <Button
                                            type="button"
                                            onClick={() => updateStatus(exercise.id, "approved")}
                                            className="h-[42px] rounded-[13.5px] bg-[#12B76A] px-[18px] text-[13.125px] font-medium leading-[18px] text-white"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <CircleCheck className="h-4 w-4" />
                                                Mark appropriate
                                            </span>
                                        </Button>

                                        <Button
                                            type="button"
                                            onClick={() => updateStatus(exercise.id, "flagged")}
                                            className="h-[42px] rounded-[13.5px] border border-[#F3A1A1] bg-white px-[18px] text-[13.125px] font-medium leading-[18px] text-[#D92D20]"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <TriangleAlert className="h-4 w-4" />
                                                Flag video
                                            </span>
                                        </Button>

                                        <Button
                                            type="button"
                                            onClick={() => updateStatus(exercise.id, "pending")}
                                            className="h-[42px] rounded-[13.5px] border border-[#DCDCF4] bg-white px-[18px] text-[13.125px] font-medium leading-[18px] text-[#0F0F14]"
                                        >
                                            Reset review
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Exercises;
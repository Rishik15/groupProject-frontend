import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CoachReviewsSection from "../../components/CoachProfile/CoachReviewSection";
import CoachProfileTabs, {
    type CoachProfileTab,
} from "../../components/CoachProfile/CoachProfileTabs";
import CoachPlaceholderSection from "../../components/CoachProfile/CoachPlaceholderSection";
import { coachReviewTheme } from "../../utils/CoachReview/coachReviewTheme";
import { ArrowLeft } from "lucide-react";
import type { CoachInfoResponse } from "../../utils/Interfaces/CoachReview/coachReview";
import { getCoachInfo } from "../../services/CoachReview/coachReviewService";

export function CoachProfilePage() {
    const navigate = useNavigate();
    const { coachId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const numericCoachId = Number(coachId);

    const [coachInfo, setCoachInfo] = useState<CoachInfoResponse | null>(null);
    const [isCoachInfoLoading, setIsCoachInfoLoading] = useState(true);
    const [coachInfoError, setCoachInfoError] = useState("");

    const selectedTab = useMemo<CoachProfileTab>(() => {
        const tab = searchParams.get("tab");

        if (tab === "reviews") return "reviews";
        if (tab === "success-stories") return "success-stories";
        return "about";
    }, [searchParams]);

    const handleTabChange = (tab: CoachProfileTab) => {
        setSearchParams({ tab });
    };

    useEffect(() => {
        const fetchCoachInfo = async () => {
            try {
                setIsCoachInfoLoading(true);
                setCoachInfoError("");

                const data = await getCoachInfo(numericCoachId);
                setCoachInfo(data);
            } catch {
                setCoachInfoError("Failed to load coach info.");
            } finally {
                setIsCoachInfoLoading(false);
            }
        };

        if (!Number.isFinite(numericCoachId) || numericCoachId <= 0) {
            setCoachInfoError("Invalid coach id.");
            setIsCoachInfoLoading(false);
            return;
        }

        void fetchCoachInfo();
    }, [numericCoachId]);

    if (!Number.isFinite(numericCoachId) || numericCoachId <= 0) {
        return (
            <div className="mx-auto max-w-5xl px-6 py-8">
                <p
                    style={{
                        color: coachReviewTheme.colors.heading,
                        fontSize: coachReviewTheme.fontSizes.label,
                    }}
                >
                    Invalid coach id.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8">
            <button
                type="button"
                onClick={() => navigate("/client/coaches")}
                className="w-fit bg-transparent flex items-center gap-1"
                style={{
                    color: coachReviewTheme.colors.secondaryText,
                    fontSize: coachReviewTheme.fontSizes.label,
                }}
            >
                <div className="flex items-center gap-2">
                    <ArrowLeft size={16} />
                    <span>Back to coaches</span>
                </div>
            </button>

            <div
                className="rounded-2xl border p-6"
                style={{
                    borderColor: coachReviewTheme.colors.border,
                    backgroundColor: coachReviewTheme.colors.white,
                }}
            >
                {isCoachInfoLoading ? (
                    <p
                        style={{
                            color: coachReviewTheme.colors.secondaryText,
                            fontSize: coachReviewTheme.fontSizes.label,
                        }}
                    >
                        Loading coach profile...
                    </p>
                ) : coachInfoError ? (
                    <p
                        style={{
                            color: coachReviewTheme.colors.danger,
                            fontSize: coachReviewTheme.fontSizes.label,
                        }}
                    >
                        {coachInfoError}
                    </p>
                ) : (
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-col gap-3">
                            <div>
                                <h1
                                    className="font-semibold"
                                    style={{
                                        color: coachReviewTheme.colors.heading,
                                        fontSize: coachReviewTheme.fontSizes.title,
                                    }}
                                >
                                    {coachInfo?.first_name} {coachInfo?.last_name}
                                </h1>

                                <p
                                    className="mt-2"
                                    style={{
                                        color: coachReviewTheme.colors.secondaryText,
                                        fontSize: coachReviewTheme.fontSizes.label,
                                    }}
                                >
                                    Coach ID: {numericCoachId}
                                </p>
                            </div>

                            {coachInfo?.coach_description ? (
                                <p
                                    style={{
                                        color: coachReviewTheme.colors.secondaryText,
                                        fontSize: coachReviewTheme.fontSizes.body,
                                    }}
                                >
                                    {coachInfo.coach_description}
                                </p>
                            ) : null}

                            <div className="flex flex-wrap gap-4">
                                {coachInfo?.height !== null && coachInfo?.height !== undefined ? (
                                    <p
                                        style={{
                                            color: coachReviewTheme.colors.secondaryText,
                                            fontSize: coachReviewTheme.fontSizes.label,
                                        }}
                                    >
                                        Height: {coachInfo.height}
                                    </p>
                                ) : null}

                                {coachInfo?.weight !== null && coachInfo?.weight !== undefined ? (
                                    <p
                                        style={{
                                            color: coachReviewTheme.colors.secondaryText,
                                            fontSize: coachReviewTheme.fontSizes.label,
                                        }}
                                    >
                                        Weight: {coachInfo.weight}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="md:text-right">
                            <p
                                className="font-semibold"
                                style={{
                                    color: coachReviewTheme.colors.primary,
                                    fontSize: coachReviewTheme.fontSizes.title,
                                }}
                            >
                                ${coachInfo?.price ?? 0}
                            </p>

                            <p
                                style={{
                                    color: coachReviewTheme.colors.secondaryText,
                                    fontSize: coachReviewTheme.fontSizes.label,
                                }}
                            >
                                per session
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <CoachProfileTabs
                selectedTab={selectedTab}
                onTabChange={handleTabChange}
            />

            {selectedTab === "reviews" ? (
                <CoachReviewsSection coachId={numericCoachId} />
            ) : selectedTab === "success-stories" ? (
                <CoachPlaceholderSection message="Success stories not added yet." />
            ) : (
                <CoachPlaceholderSection message="About section not added yet." />
            )}
        </div>
    );
}
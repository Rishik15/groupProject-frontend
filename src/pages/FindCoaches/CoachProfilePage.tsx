import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CoachReviewsSection from "../../components/CoachProfile/CoachReviewSection";
import CoachProfileTabs, {
    type CoachProfileTab,
} from "../../components/CoachProfile/CoachProfileTabs";
import CoachPlaceholderSection from "../../components/CoachProfile/CoachPlaceholderSection";
import { coachReviewTheme } from "../../utils/CoachReview/coachReviewTheme";

export function CoachProfilePage() {
    const navigate = useNavigate();
    const { coachId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const numericCoachId = Number(coachId);

    const selectedTab = useMemo<CoachProfileTab>(() => {
        const tab = searchParams.get("tab");

        if (tab === "reviews") return "reviews";
        if (tab === "success-stories") return "success-stories";
        return "about";
    }, [searchParams]);

    const handleTabChange = (tab: CoachProfileTab) => {
        setSearchParams({ tab });
    };

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
                <ArrowLeft className="w-4 h-4" />
                 Back to coaches
            </button>

            <div
                className="rounded-2xl border p-6"
                style={{
                    borderColor: coachReviewTheme.colors.border,
                    backgroundColor: coachReviewTheme.colors.white,
                }}
            >
                <h1
                    className="font-semibold"
                    style={{
                        color: coachReviewTheme.colors.heading,
                        fontSize: coachReviewTheme.fontSizes.title,
                    }}
                >
                    Coach Profile
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
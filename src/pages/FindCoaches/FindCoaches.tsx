import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { coachReviewTheme } from "../../utils/CoachReview/coachReviewTheme";

const sampleCoachId = 2;

// Temporary MVP page used to enter the coach profile flow.
// This stays intentionally small until the real coach search/list page is built.
export function FindCoaches() {
    const navigate = useNavigate();

    const handleOpenCoachReviews = () => {
        navigate(`/client/coaches/${sampleCoachId}?tab=reviews`);
    };

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8">
            <div>
                <h1
                    className="font-semibold"
                    style={{
                        color: coachReviewTheme.colors.heading,
                        fontSize: coachReviewTheme.fontSizes.title,
                    }}
                >
                    Find Coaches
                </h1>

                <p
                    style={{
                        color: coachReviewTheme.colors.secondaryText,
                        fontSize: coachReviewTheme.fontSizes.label,
                    }}
                >
                    Temporary page for testing the coach review MVP.
                </p>
            </div>

            <div
                className="rounded-2xl border p-6"
                style={{
                    borderColor: coachReviewTheme.colors.border,
                    backgroundColor: coachReviewTheme.colors.white,
                }}
            >
                <p
                    className="mb-3 font-semibold"
                    style={{
                        color: coachReviewTheme.colors.heading,
                        fontSize: coachReviewTheme.fontSizes.label,
                    }}
                >
                    Sample Coach
                </p>

                <p
                    className="mb-4"
                    style={{
                        color: coachReviewTheme.colors.secondaryText,
                        fontSize: coachReviewTheme.fontSizes.body,
                    }}
                >
                    Coach ID: {sampleCoachId}
                </p>

                <Button
                    onPress={handleOpenCoachReviews}
                    variant="primary"
                    style={{
                        backgroundColor: coachReviewTheme.colors.primary,
                        color: "#FFFFFF",
                        fontSize: coachReviewTheme.fontSizes.label,
                    }}
                >
                    Open Coach {sampleCoachId} Page
                </Button>
            </div>
        </div>
    );
}

import type {
    CoachReview,
    RatingBreakdownRow,
} from "../Interfaces/CoachReview/coachReview";

// Convert the backend review row into a display name
// keep the last initial to match the figma design
export function formatReviewerName(review: CoachReview): string {
    const lastInitial = review.reviewer_last_name
        ? `${review.reviewer_last_name.charAt(0)}.`
        : "";

    return `${review.reviewer_first_name} ${lastInitial}`.trim();
}

export function formatRelativeDate(dateString: string): string {
    // The backend returns ISO-looking strings like "2026-03-22T14:30:00"
    // treat as UTC so the browser does not interpret them as local time and make reviews appear too new.
    const normalizedDateString =
        /z|[+-]\d{2}:\d{2}$/i.test(dateString) ? dateString : `${dateString}Z`;

    const created = new Date(normalizedDateString).getTime();
    const now = Date.now();
    const diff = now - created;

    // fall back to a simple label instead of showing bad math.
    if (Number.isNaN(created)) {
        return "Recently";
    }

    const safeDiff = Math.max(0, diff);

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;

    if (safeDiff < hour) {
        const minutes = Math.max(1, Math.floor(safeDiff / minute));
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }

    if (safeDiff < day) {
        const hours = Math.floor(safeDiff / hour);
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    if (safeDiff < week) {
        const days = Math.floor(safeDiff / day);
        return `${days} day${days === 1 ? "" : "s"} ago`;
    }

    if (safeDiff < month) {
        const weeks = Math.floor(safeDiff / week);
        return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
    }

    const months = Math.floor(safeDiff / month);
    return `${months} month${months === 1 ? "" : "s"} ago`;
}

// Build the star summary bars from the review list
export function buildRatingBreakdown(
    reviews: CoachReview[]
): RatingBreakdownRow[] {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach((review) => {
        counts[review.rating as 1 | 2 | 3 | 4 | 5] += 1;
    });

    const total = reviews.length;

    return [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: counts[star as 1 | 2 | 3 | 4 | 5],
        percent:
            total === 0 ? 0 : (counts[star as 1 | 2 | 3 | 4 | 5] / total) * 100,
    }));
}

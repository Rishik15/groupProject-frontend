import { Star } from "lucide-react";
import { coachReviewTheme } from "../../utils/CoachReview/coachReviewTheme";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
}

export default function StarRating({
  rating,
  onChange,
  size = 18,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isFilled = starValue <= rating;

        if (onChange) {
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onChange(starValue)}
              className="bg-transparent"
              aria-label={`Set rating to ${starValue}`}
            >
              <Star
                size={size}
                color={
                  isFilled
                    ? coachReviewTheme.colors.star
                    : coachReviewTheme.colors.secondaryText
                }
                fill={isFilled ? coachReviewTheme.colors.star : "transparent"}
              />
            </button>
          );
        }

        return (
          <Star
            key={starValue}
            size={size}
            color={
              isFilled
                ? coachReviewTheme.colors.star
                : coachReviewTheme.colors.secondaryText
            }
            fill={isFilled ? coachReviewTheme.colors.star : "transparent"}
          />
        );
      })}
    </div>
  );
}

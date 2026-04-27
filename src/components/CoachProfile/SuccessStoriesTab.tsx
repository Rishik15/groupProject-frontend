import { Card } from "@heroui/react";
import type { Review } from "../../services/contract/requestcontracts.ts";

export default function SuccessStoriesTab({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-default-400">No success stories yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((review) => (
        <Card key={review.review_id} className="p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              {review.reviewer_first_name} {review.reviewer_last_name}
            </span>
            <span className="text-xs font-medium text-[#5B5EF4]">
              {review.rating === 5
                ? "Excellent"
                : review.rating >= 4
                  ? "Great"
                  : "Good"}{" "}
              experience
            </span>
          </div>
          <p className="text-sm text-default-500 leading-relaxed">
            {review.review_text}
          </p>
        </Card>
      ))}
    </div>
  );
}

import { Card } from "@heroui/react";
import { StarRating } from "../LandingPage/CoachCard";
import type { Review } from "../../services/contract/requestcontracts.ts";

export default function ReviewsTab({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-default-400">No reviews yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((review) => (
        <Card key={review.review_id} className="p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              {review.reviewer_first_name} {review.reviewer_last_name}
            </span>
            <span className="text-xs text-default-400">
              {new Date(review.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          </div>
          <StarRating rating={review.rating} reviewCount={0} />
          <p className="text-sm text-default-500 leading-relaxed">{review.review_text}</p>
        </Card>
      ))}
    </div>
  );
}
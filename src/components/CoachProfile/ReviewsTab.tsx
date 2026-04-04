import { Card } from "@heroui/react";
import { StarRating } from "../LandingPage/CoachCard";

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
}

interface ReviewsTabProps {
  reviews: Review[];
}

export default function ReviewsTab({ reviews }: ReviewsTabProps) {
  if (reviews.length === 0) {
    return <p className="text-sm text-default-400">No reviews yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((review) => (
        <Card key={review.id} className="p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{review.author}</span>
            <span className="text-xs text-default-400">{review.date}</span>
          </div>
          <StarRating rating={review.rating} reviewCount={0} />
          <p className="text-sm text-default-500 leading-relaxed">{review.text}</p>
        </Card>
      ))}
    </div>
  );
}
import { Card, Skeleton } from "@heroui/react";
import type { Coach } from "../../utils/Interfaces/coachquery";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function StarRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="#F5A623">
        <path d="M8 1l1.854 3.756L14 5.528l-3 2.924.708 4.132L8 10.5l-3.708 2.084L5 8.452 2 5.528l4.146-.772z" />
      </svg>
      <span className="text-[12px] font-semibold text-foreground">
        {Number(rating || 0).toFixed(1)}
      </span>
      <span className="text-[12px] text-default-400">
        ({Number(reviewCount || 0)})
      </span>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <Card className="p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-36 rounded-lg" />
        <Skeleton className="h-3 w-24 rounded-lg" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20 rounded-lg" />
        <Skeleton className="h-3 w-24 rounded-lg" />
      </div>
    </Card>
  );
}

export default function CoachCard({ coach }: { coach: Coach }) {
  const navigate = useNavigate();

  return (
    <Card className="p-6 h-full flex flex-col justify-between rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-8">
        <div className="flex gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full bg-[#5B5EF4]/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-[#5B5EF4]">
              {coach.first_name?.[0]}
              {coach.last_name?.[0]}
            </span>
          </div>

          <div className="flex flex-col min-w-0 gap-1">
            <h3 className="text-[15px] font-semibold text-foreground">
              {coach.first_name} {coach.last_name}
            </h3>

            <p className="text-[13px] text-default-400 truncate">
              {coach.coach_description}
            </p>

            <div className="mt-1">
              <StarRating
                rating={coach.avg_rating}
                reviewCount={coach.review_count}
              />
            </div>
          </div>
        </div>

        <div className="text-right shrink-0 flex flex-col items-end">
          <span className="text-[16px] font-semibold text-[#5B5EF4]">
            ${coach.price}
          </span>
          <span className="text-[10px] text-default-400">per session</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigate(`/coaches/${coach.coach_id}`)}
          className="text-[13px] font-medium text-[#5B5EF4] hover:underline flex gap-1 items-center"
        >
          View Profile
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}

import { Card, Skeleton } from "@heroui/react";
import type { Coach } from "../../utils/Interfaces/coachquery";
import { useNavigate } from "react-router-dom";

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
    <Card className="p-6 flex flex-col gap-6 shadow-sm min-h-28">
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
    <Card className="p-6 flex flex-col gap-4 shadow-sm h-full min-h-28">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#5B5EF4]/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-[#5B5EF4]">
              {coach.first_name?.[0] ?? ""}{coach.last_name?.[0] ?? ""}
            </span>
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">
              {coach.first_name} {coach.last_name}
            </span>
            <p className="text-xs text-default-400">{coach.coach_description}</p>
            <StarRating rating={coach.avg_rating} reviewCount={coach.review_count} />
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-[#5B5EF4]">${coach.price}</p>
          <p className="text-xs text-default-400">per session</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span
          onClick={() => navigate(`/coaches/${coach.coach_id}`)}
          className="text-[12px] font-medium text-foreground hover:underline cursor-pointer"
        >
          View Profile
        </span>
      </div>
    </Card>
  );
}
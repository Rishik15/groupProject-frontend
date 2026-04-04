import { StarRating } from "../LandingPage/CoachCard";
import { useState } from "react";

// i will replace with real data from backend when route is ready
interface ProfileHeaderProps {
  first_name: string;
  last_name: string;
  coach_description: string;
  avg_rating: number;
  review_count: number;
  price_per_session: number;
  years_exp: number;
}

export default function ProfileHeader({
  first_name,
  last_name,
  coach_description,
  avg_rating,
  review_count,
  price_per_session,
  years_exp,
}: ProfileHeaderProps) {
  const [requested, setRequested] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-default-100 flex items-center justify-center shrink-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
            </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {first_name} {last_name}
            </h1>
            <p className="text-sm text-default-400">{coach_description}</p>
            <div className="flex items-center gap-3 mt-1">
              <StarRating rating={avg_rating} reviewCount={review_count} />
              <span className="flex items-center gap-1 text-xs text-default-400 border border-default-200 rounded-full px-2.5 py-0.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {years_exp}yr exp
              </span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-bold text-primary">${price_per_session}</p>
          <p className="text-xs text-default-400">per session</p>
        </div>
      </div>


      <div className="flex gap-3">
        <button
            onClick={() => !requested && setRequested(true)}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-xl transition-colors ${
            requested
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-[#5B5EF4] text-white hover:bg-[#4B4EE4]"
            }`}
            >
            {requested && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            )}
            {requested ? "Request Sent!" : "Request Coaching"}
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-foreground border border-default-200 px-5 py-2.5 rounded-xl bg-white hover:bg-default-50 transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Message
        </button>
      </div>
    </div>
  );
}
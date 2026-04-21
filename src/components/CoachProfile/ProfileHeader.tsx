import { useState } from "react";
import { StarRating } from "../LandingPage/CoachCard";
import { requestCoachContract, type CoachProfile } from "../../services/contract/requestcontracts.ts";

interface ProfileHeaderProps {
  coach: CoachProfile;
  coachId: number;
}

export default function ProfileHeader({ coach, coachId }: ProfileHeaderProps) {
  const [requested, setRequested] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestCoaching = async () => {
    if (requested || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await requestCoachContract(coachId);
      setRequested(true);
    } catch (err) {
      console.error("Failed to request coaching:", err);
      setError("Could not send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {coach.profile_picture ? (
            <img
              src={coach.profile_picture}
              alt={`${coach.first_name} ${coach.last_name}`}
              className="w-14 h-14 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-default-100 flex items-center justify-center shrink-0">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {coach.first_name} {coach.last_name}
            </h1>
            <p className="text-sm text-default-400">{coach.coach_description}</p>
            <div className="flex items-center gap-3 mt-1">
              <StarRating rating={coach.avg_rating} reviewCount={coach.reviews.length} />
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-bold text-[#5B5EF4]">${coach.price}</p>
          <p className="text-xs text-default-400">per session</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleRequestCoaching}
          disabled={requested || isSubmitting}
          className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-xl transition-colors disabled:cursor-not-allowed ${requested
            ? "bg-green-50 text-green-600 border border-green-200"
            : isSubmitting
              ? "bg-[#5B5EF4]/70 text-white"
              : "bg-[#5B5EF4] text-white hover:bg-[#4B4EE4]"
            }`}
        >
          {requested && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )}
          {requested ? "Request Sent!" : isSubmitting ? "Sending..." : "Request Coaching"}
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-foreground border border-default-200 px-5 py-2.5 rounded-xl bg-white hover:bg-default-50 transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Message
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
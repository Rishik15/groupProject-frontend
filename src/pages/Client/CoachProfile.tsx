import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileHeader from "../../components/CoachProfile/ProfileHeader.tsx";
import ProfileTabs, {
  type Tab,
} from "../../components/CoachProfile/ProfileTabs.tsx";
import AboutTab from "../../components/CoachProfile/AboutTab.tsx";
import CoachReviewsSection from "../../components/CoachProfile/CoachReviewSection.tsx";
import ReviewsTab from "../../components/CoachProfile/ReviewsTab.tsx";
import SuccessStoriesTab from "../../components/CoachProfile/SuccessStoriesTab.tsx";
import {
  getCoachProfile,
  type CoachProfile as CoachProfileType,
} from "../../services/contract/requestcontracts.ts";
import { useAuth } from "../../utils/auth/AuthContext";

export default function CoachProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("about");
  const [coach, setCoach] = useState<CoachProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const { status, activeMode, hasCheckedAuth } = useAuth();

  const mode =
    hasCheckedAuth && status === "authenticated" && activeMode === "client"
      ? "app"
      : "landing";

  const coachId = id ? Number(id) : null;

  const loadCoachProfile = useCallback(async () => {
    if (!coachId || Number.isNaN(coachId)) {
      setCoach(null);
      setLoading(false);
      return;
    }

    try {
      const data = await getCoachProfile(coachId);
      setCoach(data);
    } catch (error) {
      console.error("Failed to load coach profile:", error);
      setCoach(null);
    } finally {
      setLoading(false);
    }
  }, [coachId]);

  useEffect(() => {
    void loadCoachProfile();
  }, [loadCoachProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-default-100 flex items-center justify-center">
        <p className="text-sm text-default-400">Loading...</p>
      </div>
    );
  }

  if (!coach || !coachId) {
    return (
      <div className="min-h-screen bg-default-100 flex items-center justify-center">
        <p className="text-sm text-default-400">Coach not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-default-100 px-8 py-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-default-400 hover:text-foreground mb-6 transition-colors"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to coaches
      </button>

      <div className="mb-6">
        <ProfileHeader coach={coach} coachId={coachId} mode={mode} />
      </div>

      <div className="mb-5">
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeTab === "about" && <AboutTab coach={coach} />}

      {activeTab === "reviews" && (
        <div className="space-y-6">
          <CoachReviewsSection
            coachId={coachId}
            onReviewSubmitted={loadCoachProfile}
          />
          <ReviewsTab reviews={coach.reviews} />
        </div>
      )}

      {activeTab === "stories" && <SuccessStoriesTab reviews={coach.reviews} />}
    </div>
  );
}

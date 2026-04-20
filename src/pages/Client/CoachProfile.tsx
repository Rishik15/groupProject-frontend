import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileHeader from "../../components/CoachProfile/ProfileHeader";
import ProfileTabs, { type Tab } from "../../components/CoachProfile/ProfileTabs";
import AboutTab from "../../components/CoachProfile/AboutTab";
import CoachReviewsSection from "../../components/CoachProfile/CoachReviewSection";
import SuccessStoriesTab from "../../components/CoachProfile/SuccessStoriesTab";
import { getCoachProfile, type CoachProfile as CoachProfileType } from "../../services/contract/requestcontracts.ts";

export default function CoachProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("about");
  const [coach, setCoach] = useState<CoachProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const data = await getCoachProfile(Number(id));
      setCoach(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-default-100 flex items-center justify-center">
        <p className="text-sm text-default-400">Loading...</p>
      </div>
    );
  }

  if (!coach || !id) {
    return (
      <div className="min-h-screen bg-default-100 flex items-center justify-center">
        <p className="text-sm text-default-400">Coach not found.</p>
      </div>
    );
  }
  const coachId = Number(id);

  return (
    <div className="min-h-screen bg-default-100 px-8 py-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-default-400 hover:text-foreground mb-6 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to coaches
      </button>

      <div className="mb-6">
        <ProfileHeader coach={coach} coachId={coachId} />
      </div>

      <div className="mb-5">
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeTab === "about" && <AboutTab coach={coach} />}
      {activeTab === "reviews" && <CoachReviewsSection coachId={coachId} />}
      {activeTab === "stories" && <SuccessStoriesTab reviews={coach.reviews} />}
    </div>
  );
}
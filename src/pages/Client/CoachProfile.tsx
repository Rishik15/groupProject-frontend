import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../../components/CoachProfile/ProfileHeader";
import ProfileTabs, { type Tab } from "../../components/CoachProfile/ProfileTabs";
import AboutTab from "../../components/CoachProfile/AboutTab";
import ReviewsTab from "../../components/CoachProfile/ReviewsTab";
import SuccessStoriesTab from "../../components/CoachProfile/SuccessStoriesTab";

// when backend route is ready, this will be the impor i use.
// import { getCoachProfile, getCoachReviews, getCoachSuccessStories } from "../../services/coach/requestcontracts";

export default function CoachProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("about");

  // when backend is ready:
  // const { id } = useParams();
  // useEffect(() => { getCoachProfile(Number(id)).then(setCoach) }, [id]);

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
        <ProfileHeader
          first_name=""
          last_name=""
          coach_description=""
          avg_rating={0}
          review_count={0}
          price_per_session={0}
          years_exp={0}
        />
      </div>

      <div className="mb-5">
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeTab === "about" && (
        <AboutTab
          bio=""
          certifications={[]}
          specialties={[]}
          availability=""
          active_clients={0}
          success_rate={0}
        />
      )}
      {activeTab === "reviews" && <ReviewsTab reviews={[]} />}
      {activeTab === "stories" && <SuccessStoriesTab stories={[]} />}
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoachCard from "./CoachCard";
import TemplateButton from "./TemplateButton";
import { fetchTopRatedCoaches } from "./landingMockData";
import type { Coach } from "./Types";
import { ArrowRight } from "lucide-react";

// Dynamic-looking section for coach data.
// Frontend: safe place to style cards/layout.
// Fullstack/backend: replace fetchTopRatedCoaches with a service/API call.
const TopRatedCoachesSection = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const navigate = useNavigate();

  // Current working route for temporary actions.
  const landingRoute = "/landing";

  useEffect(() => {
    const loadCoaches = async () => {
      const data = await fetchTopRatedCoaches();
      setCoaches(data);
    };

    loadCoaches();
  }, []);

  return (
    <section className="border-t border-[#E6E6EE]">
      <div className="max-w-7xl mx-auto px-16 py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-[28px] font-bold text-black">
              Top-rated coaches
            </h2>
            <p className="mt-1.5 text-[16px] text-[#72728A]">
              Work with certified professionals
            </p>
          </div>

          {/*
            TEMP PLACEHOLDER:
            This routes back to the landing page for now so no new App route is needed.
            Example future route once the page exists: navigate("/coaches")
          */}
          <TemplateButton
            variant="ghost"
            className="text-[15px] flex items-center gap-0.5"
            onClick={() => navigate(landingRoute)}
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </TemplateButton>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-8 items-stretch">
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRatedCoachesSection;

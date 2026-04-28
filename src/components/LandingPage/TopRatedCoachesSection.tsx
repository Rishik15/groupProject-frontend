import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoachCard from "./CoachCard";
import TemplateButton from "./TemplateButton";
import { top5 } from "../../services/landing/top5";
import type { Coach } from "../../utils/Interfaces/coachquery";
import { ArrowRight } from "lucide-react";

const TopRatedCoachesSection = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const navigate = useNavigate();

  // Current working route for temporary actions.
  const landingRoute = "/landing";

  useEffect(() => {
    const loadCoaches = async () => {
      try {
        const data = await top5();
        setCoaches(data);
      } catch (err) {
        console.error("Failed to load coaches", err);
      }
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

          <TemplateButton
            variant="ghost"
            className="text-[15px] flex items-center gap-0.5"
            onClick={() => navigate("/coaches")}
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </TemplateButton>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-8 items-stretch">
          {coaches.map((coach) => (
            <CoachCard key={coach.coach_id} coach={coach} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRatedCoachesSection;

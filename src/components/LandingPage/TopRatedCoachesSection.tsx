import { useEffect, useState } from "react";
import CoachCard from "./CoachCard";
import TemplateButton from "./TemplateButton";
import { fetchTopRatedCoaches } from "./landingMockData";
import type { Coach } from "./types";

// Dynamic-looking section for coach data.
// Frontend: safe place to style cards/layout.
// Fullstack/backend: replace fetchTopRatedCoaches with a service/API call.
const TopRatedCoachesSection = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);

  useEffect(() => {
    const loadCoaches = async () => {
      const data = await fetchTopRatedCoaches();
      setCoaches(data);
    };

    loadCoaches();
  }, []);

  return (
    <section className="border-t border-[#E6E6EE]">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-[48px] font-bold text-black">
              Top-rated coaches
            </h2>
            <p className="mt-3 text-[18px] text-[#72728A]">
              Work with certified professionals
            </p>
          </div>

          <TemplateButton variant="ghost" className="text-[18px]">
            View all →
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
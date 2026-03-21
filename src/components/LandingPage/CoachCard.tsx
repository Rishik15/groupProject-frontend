import { useNavigate } from "react-router-dom";
import TemplateButton from "./TemplateButton";
import type { Coach } from "./Types";

// Presentational card used by the landing page coaches section.
// Keep this file UI-only. Data loading should happen in the section/component above it.
type CoachCardProps = {
  coach: Coach;
};

const CoachCard = ({ coach }: CoachCardProps) => {
  const navigate = useNavigate();

  // Current working route for temporary actions.
  const landingRoute = "/landing";

  return (
    <div className="rounded-[18px] border border-[#E6E6EE] bg-white p-7 h-[180px] flex flex-col justify-between">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#F2F2FA] flex items-center justify-center text-[#5B5EF4] text-[22px] font-semibold">
          {coach.initials}
        </div>

        <div>
          <h3 className="text-[20px] font-semibold text-black leading-tight">
            {coach.name}
          </h3>
          <p className="text-[16px] text-[#72728A]">{coach.specialty}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#F4B000] text-[18px]">★</span>
          <span className="text-[18px] font-medium text-black">
            {coach.rating}
          </span>
          <span className="text-[18px] text-[#72728A]">
            ({coach.reviewCount})
          </span>
        </div>

        {/*
          TEMP PLACEHOLDER:
          This routes back to the landing page for now so no new App route is needed.
          Example future route once the page exists: navigate(`/coaches/${coach.id}`)
        */}
        <TemplateButton
          variant="ghost"
          className="text-[16px]"
          onClick={() => navigate(landingRoute)}
        >
          View Profile
        </TemplateButton>
      </div>
    </div>
  );
};

export default CoachCard;
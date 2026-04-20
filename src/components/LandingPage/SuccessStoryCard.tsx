import type { SuccessStory } from "./Types";
import { CircleCheck } from "lucide-react";

// Presentational success-story card for the testimonials/results section.
type SuccessStoryCardProps = {
  story: SuccessStory;
};

const SuccessStoryCard = ({ story }: SuccessStoryCardProps) => {
  return (
    <div className="rounded-[20px] border border-[#E6E6EE] bg-white py-4 px-6 h-34 flex flex-col justify-start">
      <CircleCheck className="w-5 h-5 text-[#5B5EF4]"/>

      <h3 className="mt-3 text-[15px] font-semibold text-black">
        {story.name}
      </h3>

      <p className="mt-2 text-[12px] text-[#72728A]">{story.result}</p>

      <p className="mt-1 text-[12px] text-[#72728A]">
        with Coach {story.coachName}
      </p>
    </div>
  );
};

export default SuccessStoryCard;

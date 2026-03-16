import type { SuccessStory } from "./types";

// Presentational success-story card for the testimonials/results section.
type SuccessStoryCardProps = {
  story: SuccessStory;
};

const SuccessStoryCard = ({ story }: SuccessStoryCardProps) => {
  return (
    <div className="rounded-[20px] border border-[#E6E6EE] bg-white p-8 h-[200px] flex flex-col justify-start">
      <div className="w-10 h-10 rounded-full border-2 border-[#5B5EF4] text-[#5B5EF4] flex items-center justify-center text-[18px] font-bold">
        ✓
      </div>

      <h3 className="mt-6 text-[22px] font-semibold text-black">
        {story.name}
      </h3>

      <p className="mt-3 text-[18px] text-[#72728A]">{story.result}</p>

      <p className="mt-4 text-[16px] text-[#72728A]">
        with Coach {story.coachName}
      </p>
    </div>
  );
};

export default SuccessStoryCard;
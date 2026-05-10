import type { SuccessStory } from "./Types";
import { Image } from "lucide-react";

type SuccessStoryCardProps = {
  story: SuccessStory;
  onViewImage: (story: SuccessStory) => void;
};

const SuccessStoryCard = ({ story, onViewImage }: SuccessStoryCardProps) => {
  return (
    <div className="rounded-[20px] border border-[#E6E6EE] bg-white px-6 py-4 flex flex-col justify-center">
      <h3 className="text-[15px] font-semibold text-black">{story.name}</h3>

      <p className="mt-2 text-[12px] text-[#72728A]">
        {story.result} with Coach {story.coachName}
      </p>

      <button
        type="button"
        onClick={() => onViewImage(story)}
        className="mt-3 flex w-fit items-center gap-2 text-[12px] font-medium text-[#5B5EF4] hover:underline"
      >
        <Image className="h-4 w-4" />
        View before & after
      </button>
    </div>
  );
};

export default SuccessStoryCard;

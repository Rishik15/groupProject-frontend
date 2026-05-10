import SuccessStoryCard from "./SuccessStoryCard";
import { successStories } from "./landingMockData";
import type { SuccessStory } from "./Types";

type Props = {
  onViewImage: (story: SuccessStory) => void;
};

// Social-proof/testimonials section.
// Easy place for backend/fullstack teams to swap in real user success data later.
const SuccessStoriesSection = ({ onViewImage }: Props) => {
  return (
    <section className="border-t border-[#E6E6EE]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-[28px] font-bold text-black">
            Real results, real people
          </h2>

          <p className="mt-2 text-[16px] text-[#72728A]">
            Thousands of transformations — here are a few
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
          {successStories.map((story) => (
            <SuccessStoryCard
              key={story.id}
              story={story}
              onViewImage={onViewImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;

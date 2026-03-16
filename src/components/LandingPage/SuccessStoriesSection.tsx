import SuccessStoryCard from "./SuccessStoryCard";
import { successStories } from "./landingMockData";

// Social-proof/testimonials section.
// Easy place for backend/fullstack teams to swap in real user success data later.
const SuccessStoriesSection = () => {
  return (
    <section className="border-t border-[#E6E6EE]">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center">
          <h2 className="text-[48px] font-bold text-black">
            Real results, real people
          </h2>
          <p className="mt-3 text-[18px] text-[#72728A]">
            Thousands of transformations — here are a few
          </p>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-8 items-stretch">
          {successStories.map((story) => (
            <SuccessStoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
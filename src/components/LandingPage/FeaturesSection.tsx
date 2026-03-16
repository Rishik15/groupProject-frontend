import FeatureCard from "./FeatureCard";
import { features } from "./landingMockData";

// Static marketing features section.
// This can stay local unless product wants these managed by admin/CMS later.
const FeaturesSection = () => {
  return (
    <section className="border-t border-[#E6E6EE]">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center">
          <h2 className="text-[48px] font-bold text-black">
            Everything you need to reach your goals
          </h2>
          <p className="mt-3 text-[18px] text-[#72728A]">
            Built for both coaches and clients
          </p>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-8 items-stretch">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
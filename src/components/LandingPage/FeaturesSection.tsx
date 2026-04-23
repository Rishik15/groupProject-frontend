import FeatureCard from "./FeatureCard";
import { features } from "./landingMockData";

// Static marketing features section.
// This can stay local unless product wants these managed by admin/CMS later.
const FeaturesSection = () => {
  return (
    <section className="border-t border-[#E6E6EE]">
      <div className="max-w-7xl mx-auto px-16 py-16">
        <div className="text-center">
          <h2 className="text-[28px] font-bold text-black">
            Everything you need to reach your goals
          </h2>
          <p className="mt-2 text-[16px] text-[#72728A]">
            Built for both coaches and clients
          </p>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-8 items-center">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

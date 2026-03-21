import type { Feature } from "./Types";

// Presentational feature card for the landing page marketing section.
type FeatureCardProps = {
  feature: Feature;
};

const FeatureCard = ({ feature }: FeatureCardProps) => {
  return (
    <div className="rounded-[18px] border border-[#E6E6EE] bg-white p-8 h-[240px] flex flex-col">
      <div className="w-14 h-14 rounded-2xl bg-[#F2F2FA] flex items-center justify-center text-[#5B5EF4] text-2xl font-bold">
        {feature.icon}
      </div>

      <h3 className="mt-8 text-[24px] font-semibold text-black">
        {feature.title}
      </h3>

      <p className="mt-4 text-[18px] leading-[1.6] text-[#72728A] max-w-[320px]">
        {feature.description}
      </p>
    </div>
  );
};

export default FeatureCard;

import type { Feature } from "./Types";

// Presentational feature card for the landing page marketing section.
type FeatureCardProps = {
  feature: Feature;
};

const FeatureCard = ({ feature }: FeatureCardProps) => {
  const Icon = feature.icon;
  return (
    <div className="rounded-[18px] border border-[#E6E6EE] bg-white py-8 px-6 h-48 flex flex-col">
      <div className="w-10 h-12 px-2 py-2.5 rounded-xl bg-[#F2F2FA] flex items-center justify-center text-[#5B5EF4] font-bold">
        <Icon className="w-5 h-5 text-[#5B5EF4]" />
      </div>

      <h3 className="mt-4 text-[18px] font-semibold text-black">
        {feature.title}
      </h3>

      <p className="mt-3 text-[14px] leading-[1.6] text-[#72728A] max-w-[320px]">
        {feature.description}
      </p>
    </div>
  );
};

export default FeatureCard;

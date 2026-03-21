import { useNavigate } from "react-router-dom";
import TemplateButton from "./TemplateButton";
import { ArrowRightIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import landingImage from "../../assets/landing_header.jpg";
// Above-the-fold hero section.
// Register is a real route now.
// Temporary buttons route back to the landing page until their screens exist.
const HeroSection = () => {
  const navigate = useNavigate();

  // Current working routes.
  const landingRoute = "/landing";
  const registerRoute = "/register";

  return (
    <section className="max-w-7xl mx-auto px-16 py-22 grid grid-cols-2 gap-16 items-center">
      <div className="flex flex-col items-start text-left">
        <div className="leading-[0.98] tracking-[-0.03em] space-y-2">
          <h1 className="text-[46px] font-semibold text-black">
            Fitness coaching
          </h1>
          <h1 className="text-[46px] font-semibold text-[#5B5EF4]">
            that actually works
          </h1>
        </div>

        <p className="mt-8 max-w-100 text-[16px] leading-[1.7] text-[#72728A]">
          Connect with certified coaches, track every metric that matters, and
          build habits that last — all in one minimal, powerful platform.
        </p>

        <div className="mt-8 flex items-center gap-4">
          {/*
            REAL ROUTE:
            This already goes to the register page.
            If the register page path changes later, update registerRoute above.
          */}
          <TemplateButton
            variant="primary"
            onClick={() => navigate(registerRoute)}
            className="flex items-center gap-1 text-[14px] py-2"
          >
            Start free trial
            <ArrowRightIcon className="w-4 h-4" />
          </TemplateButton>

          {/*
            TEMP PLACEHOLDER:
            This routes back to the landing page for now so no new App route is needed.
            Example future route once the page exists: navigate("/coaches")
          */}
          <TemplateButton
            variant="outline"
            className="text-[14px] py-2"
            onClick={() => navigate(landingRoute)}
          >
            Browse coaches
          </TemplateButton>
        </div>

        <div className="mt-10 flex items-start gap-14">
          <div>
            <div className="text-[20px] font-bold text-black">10,000+</div>
            <div className="text-[13px] text-[#72728A]">Active Users</div>
          </div>

          <div>
            <div className="text-[20px] font-bold text-black">500+</div>
            <div className="text-[13px] text-[#72728A]">Certified Coaches</div>
          </div>

          <div>
            <div className="text-[20px] font-bold text-black">4.9</div>
            <div className="text-[13px] text-[#72728A]">Avg. Rating</div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-[28px]">
          <img
            src={landingImage}
            alt="Fitness coaching session"
            className="h-120 object-cover shadow-2xl"
          />
        </div>

        <div className="absolute left-7 right-7 bottom-7 rounded-[24px] bg-white px-6 py-4 shadow-lg">
          <div className="text-[12px] text-[#72728A]">Weekly Progress</div>

          <div className="mt-1 flex items-center justify-between">
            <div className="text-[16px] font-semibold text-black">
              5 of 6 sessions complete
            </div>
            <div className="text-[14px] text-[#5B5EF4] flex gap-1 items-center">
              <TrendingUp className="w-4 h-4" />
              +83%
            </div>
          </div>

          <div className="mt-2 h-1.5 w-full rounded-full bg-[#E9E9EF]">
            <div className="h-1.5 w-[83%] rounded-full bg-[#5B5EF4]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

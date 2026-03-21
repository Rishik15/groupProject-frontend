import { useNavigate } from "react-router-dom";
import TemplateButton from "./TemplateButton";
import 

// Above-the-fold hero section.
// Register is a real route now.
// Temporary buttons route back to the landing page until their screens exist.
const HeroSection = () => {
  const navigate = useNavigate();

  // Current working routes.
  const landingRoute = "/landing";
  const registerRoute = "/register";

  return (
    <section className="max-w-7xl mx-auto px-14 py-16 grid grid-cols-2 gap-16 items-center">
      <div className="flex flex-col items-start text-left">
        <div className="leading-[0.98] tracking-[-0.03em] space-y-2">
          <h1 className="text-[46px] font-semibold text-black">Fitness coaching</h1>
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
          >
            Start free trial

          </TemplateButton>

          {/*
            TEMP PLACEHOLDER:
            This routes back to the landing page for now so no new App route is needed.
            Example future route once the page exists: navigate("/coaches")
          */}
          <TemplateButton
            variant="outline"
            onClick={() => navigate(landingRoute)}
          >
            Browse coaches
          </TemplateButton>
        </div>

        <div className="mt-14 flex items-start gap-14">
          <div>
            <div className="text-[26px] font-bold text-black">10,000+</div>
            <div className="text-[16px] text-[#72728A]">Active Users</div>
          </div>

          <div>
            <div className="text-[26px] font-bold text-black">500+</div>
            <div className="text-[16px] text-[#72728A]">Certified Coaches</div>
          </div>

          <div>
            <div className="text-[26px] font-bold text-black">4.9</div>
            <div className="text-[16px] text-[#72728A]">Avg. Rating</div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-[28px]">
          <img
            src="/coach-hero.jpg"
            alt="Fitness coaching session"
            className="w-full h-[620px] object-cover"
          />
        </div>

        <div className="absolute left-7 right-7 bottom-7 rounded-[24px] bg-white px-6 py-5 shadow-lg">
          <div className="text-[16px] text-[#72728A]">Weekly Progress</div>

          <div className="mt-1 flex items-center justify-between">
            <div className="text-[20px] font-semibold text-black">
              5 of 6 sessions complete
            </div>
            <div className="text-[18px] font-semibold text-[#5B5EF4]">+83%</div>
          </div>

          <div className="mt-4 h-2 w-full rounded-full bg-[#E9E9EF]">
            <div className="h-2 w-[83%] rounded-full bg-[#5B5EF4]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

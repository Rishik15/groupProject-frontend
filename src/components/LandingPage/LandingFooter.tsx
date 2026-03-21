import { useNavigate } from "react-router-dom";
import TemplateButton from "./TemplateButton";

// Final landing page CTA plus legal/footer row.
// Register is a real route now.
const LandingFooter = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  // Current working route.
  const registerRoute = "/register";

  return (
    <section className="border-t border-[#E6E6EE]">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="rounded-[32px] bg-[#5B5EF4] px-8 py-20 text-center">
          <h2 className="text-[56px] font-bold text-white">
            Ready to start your journey?
          </h2>

          <p className="mt-5 text-[22px] text-white/90">
            Join 10,000+ people transforming their fitness with βFit
          </p>

          <div className="mt-10 flex justify-center">
            {/*
              REAL ROUTE:
              This already goes to the register page.
              If the register page path changes later, update registerRoute above.
            */}
            <TemplateButton
              variant="primary"
              className="!bg-white !text-[#5B5EF4] hover:!bg-[#EFEEFE] hover:!text-[#5B5EF4] px-8 py-3"
              onClick={() => navigate(registerRoute)}
            >
              Create free account
            </TemplateButton>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-[25px] text-white font-bold w-10 h-10 flex items-center justify-center bg-[#5B5EF4] rounded-lg">
              βF
            </div>

            <div className="text-[25px] font-bold text-black">βFit</div>
          </div>

          <p className="text-[18px] text-[#72728A]">
            © {currentYear} βFit. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LandingFooter;

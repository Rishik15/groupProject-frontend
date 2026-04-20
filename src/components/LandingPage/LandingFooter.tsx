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
    <section className="border-t border-[#E6E6EE] relative">
      <div className="max-w-7xl mx-auto px-16 py-16 pb-30">
        <div className="rounded-2xl bg-[#5B5EF4] px-8 py-8 text-center">
          <h2 className="text-[28px] font-bold text-white">
            Ready to start your journey?
          </h2>

          <p className="mt-2.5 text-[15px] text-white/90">
            Join 10,000+ people transforming their fitness with βFit
          </p>

          <div className="mt-4 flex justify-center">
            {/*
              REAL ROUTE:
              This already goes to the register page.
              If the register page path changes later, update registerRoute above.
            */}
            <TemplateButton
              variant="primary"
              className="bg-white! text-[#5B5EF4]! hover:bg-[#EFEEFE]! hover:text-[#5B5EF4]! px-4 py-2 text-[14px]"
              onClick={() => navigate(registerRoute)}
            >
              Create free account
            </TemplateButton>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full border-t border-[#E6E6EE]">
          <div className="max-w-7xl h-14 mx-auto px-16 py-2 flex items-center justify-end">
            <p className="text-[12px] text-[#72728A]">
              © {currentYear} βFit. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFooter;

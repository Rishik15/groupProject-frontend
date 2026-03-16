import TemplateButton from "./TemplateButton";

// Final landing page CTA plus legal/footer row.
// Frontend: adjust spacing/copy here.
// Fullstack: hook CTA action/route here.
// Backend: only needed if footer content becomes configurable.
const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

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
            <TemplateButton
              variant="primary"
              className="!bg-white !text-[#5B5EF4] hover:!bg-[#EFEEFE] hover:!text-[#5B5EF4] px-8 py-3"
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
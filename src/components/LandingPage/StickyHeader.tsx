import { useNavigate } from "react-router-dom";
import TemplateButton from "./TemplateButton";

// Sticky landing-page header.
// Register is a real route now.
// Temporary buttons route back to the landing page until their screens exist.
const StickyHeader = () => {
  const navigate = useNavigate();

  // Current working routes.
  const landingRoute = "/landing";
  const registerRoute = "/register";

  return (
    <header className="sticky top-0 z-[100] w-full bg-white border-b border-[#E6E6EE] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="text-[25px] text-white font-bold w-10 h-10 flex items-center justify-center bg-[#5B5EF4] rounded-lg">
            βF
          </div>

          <div className="text-[25px] font-bold">βFit</div>

          <div className="ml-auto flex items-center gap-3">
            {/*
              TEMP PLACEHOLDER:
              This routes back to the landing page for now so no new App route is needed.
              Example future route once the page exists: navigate("/signin")
            */}
            <TemplateButton variant="ghost" onClick={() => navigate(landingRoute)}>
              Sign in
            </TemplateButton>

            {/*
              REAL ROUTE:
              This already goes to the register page.
              If the register page path changes later, update registerRoute above.
            */}
            <TemplateButton
              variant="primary"
              className="px-4 py-2"
              onClick={() => navigate(registerRoute)}
            >
              Get Started
            </TemplateButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StickyHeader;

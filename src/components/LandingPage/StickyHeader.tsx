import { useNavigate } from "react-router-dom";
import TemplateButton from "./TemplateButton";
import { Link } from "react-router-dom";

// Sticky landing-page header.
// Register is a real route now.
// Temporary buttons route back to the landing page until their screens exist.
const StickyHeader = () => {
  const navigate = useNavigate();

  // Current working routes.
  const signin = "/signin";
  const registerRoute = "/register";

  return (
    <header className="sticky top-0 h-14 z-100 bg-[#f8f8fb] border-b border-[#E6E6EE] shadow-sm">
      <div className="max-w-7xl mx-auto h-14 px-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-white text-[12px] font-semibold w-7 h-7 flex items-center justify-center bg-[#5B5EF4] rounded-lg p-0">
            βF
          </div>
          <span className="text-[15px] font-semibold">βFit</span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {/*
              TEMP PLACEHOLDER:
              This routes back to the landing page for now so no new App route is needed.
              Example future route once the page exists: navigate("/signin")
            */}
          <TemplateButton
            variant="ghost"
            className="text-[14px]"
            onClick={() => navigate(signin)}
          >
            Sign in
          </TemplateButton>

          {/*
              REAL ROUTE:
              This already goes to the register page.
              If the register page path changes later, update registerRoute above.
            */}
          <TemplateButton
            variant="primary"
            className="text-[14px]"
            onClick={() => navigate(registerRoute)}
          >
            Get Started
          </TemplateButton>
        </div>
      </div>
    </header>
  );
};

export default StickyHeader;

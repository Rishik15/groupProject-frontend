import StickyHeader from "../../components/LandingPage/StickyHeader";
import HeroSection from "../../components/LandingPage/HeroSection";
import FeaturesSection from "../../components/LandingPage/FeaturesSection";
import TopRatedCoachesSection from "../../components/LandingPage/TopRatedCoachesSection";
import SuccessStoriesSection from "../../components/LandingPage/SuccessStoriesSection";
import LandingFooter from "../../components/LandingPage/LandingFooter";

// Keep page files thin: assemble major sections here instead of putting layout markup directly in the page.
// Landing page body composition.
// Keep this file lightweight so the page flow is easy to scan.
// If a new section is added later, import it here and place it in order.
const LandingPage = () => {
  return (
    <div>
      <StickyHeader />
      <div className="relative z-0">
        <HeroSection />
        <FeaturesSection />
        <TopRatedCoachesSection />
        <SuccessStoriesSection />
      </div>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;

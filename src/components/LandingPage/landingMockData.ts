import type { Feature, SuccessStory } from "./Types";
import { Users, TrendingUp, Award } from "lucide-react";

// Temporary landing page data used until backend integration is ready.
// Frontend devs can safely style against this.
// Fullstack/backend devs can replace the async fetch function with a real API call.

export const features: Feature[] = [
  {
    id: 1,
    icon: Users,
    title: "Expert Coaches",
    description:
      "Connect with certified trainers matched to your goals and schedule.",
  },
  {
    id: 2,
    icon: TrendingUp,
    title: "Track Progress",
    description:
      "Visual dashboards and trend charts to see exactly how far you've come.",
  },
  {
    id: 3,
    icon: Award,
    title: "Custom Plans",
    description:
      "Personalized workout and nutrition guidance built around your life.",
  },
];

export const successStories: SuccessStory[] = [
  {
    id: 1,
    name: "John D.",
    result: "Built muscle and transformed his physique in 4 months",
    coachName: "Sarah",
    imageUrl: "/successStories/john_before_after.png",
  },
  {
    id: 2,
    name: "Maria S.",
    result: "Lost 18 lbs and built a leaner physique",
    coachName: "Mike",
    imageUrl: "/successStories/maria_before_after.png",
  },
  {
    id: 3,
    name: "Alex T.",
    result: "Completed his first marathon and improved endurance in 5 months",
    coachName: "Emily",
    imageUrl: "/successStories/alex_marathon.png",
  },
];

// Mock async function to mirror what a service call will look like.
// Replace this with a service call later, for example:
// return landingPageService.getTopRatedCoaches();

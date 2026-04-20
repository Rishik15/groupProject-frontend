import type { Coach, Feature, SuccessStory } from "./Types";
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
    result: "Lost 30 lbs in 3 months",
    coachName: "Sarah",
  },
  {
    id: 2,
    name: "Maria S.",
    result: "Gained 10 lbs of muscle",
    coachName: "Mike",
  },
  {
    id: 3,
    name: "Alex T.",
    result: "Completed first marathon",
    coachName: "Emily",
  },
];

// Mock async function to mirror what a ervice call will look like.
// Replace this with a service call later, for example:
// return landingPageService.getTopRatedCoaches();
export const fetchTopRatedCoaches = async (): Promise<Coach[]> => {
  return [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "Strength Training",
      rating: 4.9,
      reviewCount: 127,
      initials: "SJ",
    },
    {
      id: 2,
      name: "Mike Chen",
      specialty: "HIIT & Cardio",
      rating: 4.8,
      reviewCount: 94,
      initials: "MC",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      specialty: "Yoga & Wellness",
      rating: 4.9,
      reviewCount: 156,
      initials: "ER",
    },
  ];
};
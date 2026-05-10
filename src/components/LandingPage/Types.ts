import type { LucideIcon } from "lucide-react";

export type Feature = {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
};

export type SuccessStory = {
  id: number;
  name: string;
  result: string;
  coachName: string;
  imageUrl: string;
};

export type Coach = {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  initials: string;
};

// Shared landing-page data types.
// Keep these separate from presentational components so multiple sections
// can reuse the same shapes without importing from UI files.

export type Feature = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

export type Coach = {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  initials: string;
};

export type SuccessStory = {
  id: number;
  name: string;
  result: string;
  coachName: string;
};

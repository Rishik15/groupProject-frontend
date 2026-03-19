import type { SelectCardOption } from "../../components/OnboardingSurvey/SelectCardGroup";

// Shared shape for the data collected on the credentials step.
// Keeping this in the survey config file prevents duplicate local types in step components.
export interface CoachCredentialsValues {
  certifications: string;
  yearsExperience: string;
  bio: string;
}

// Central step copy used by the coach onboarding page header.
// An array keeps page lookup simple and avoids object key casts in the page file.
export const coachSteps = [
  {
    title: "Primary Specialties",
    subtitle: "Choose up to 3 areas you specialize in most",
  },
  {
    title: "Secondary Specialties",
    subtitle: "Additional areas you can also coach in (optional)",
  },
  {
    title: "Who do you coach?",
    subtitle: "Select the client types you prefer working with",
  },
  {
    title: "Credentials",
    subtitle: "Optional — helps clients trust your expertise",
  },
  {
    title: "Coach Profile Ready",
    subtitle: "",
  },
] as const;

export const coachTotalSteps = coachSteps.length;

// These options drive the reusable HeroUI SelectCardGroup for primary specialties.
// The stored value stays stable for state and backend use, while the label is what the user sees.
export const coachPrimarySpecialtyOptions: SelectCardOption[] = [
  {
    value: "strength_training",
    label: "Strength Training",
    description: "Powerlifting, weightlifting",
  },
  {
    value: "hiit_cardio",
    label: "HIIT & Cardio",
    description: "High-intensity intervals",
  },
  {
    value: "yoga_pilates",
    label: "Yoga & Pilates",
    description: "Flexibility & mindfulness",
  },
  {
    value: "nutrition_coaching",
    label: "Nutrition Coaching",
    description: "Diet & meal planning",
  },
  {
    value: "weight_loss",
    label: "Weight Loss",
    description: "Fat loss programs",
  },
  {
    value: "athletic_performance",
    label: "Athletic Performance",
    description: "Sports-specific training",
  },
  {
    value: "mobility_recovery",
    label: "Mobility & Recovery",
    description: "Injury prevention",
  },
  {
    value: "senior_fitness",
    label: "Senior Fitness",
    description: "50+ specialized coaching",
  },
];

// Label maps are used mainly by summary screens. They let components render readable text
// without repeating option labels or depending on the full options array.
export const coachSpecialtyLabelMap: Record<string, string> = {
  strength_training: "Strength Training",
  hiit_cardio: "HIIT & Cardio",
  yoga_pilates: "Yoga & Pilates",
  nutrition_coaching: "Nutrition Coaching",
  weight_loss: "Weight Loss",
  athletic_performance: "Athletic Performance",
  mobility_recovery: "Mobility & Recovery",
  senior_fitness: "Senior Fitness",
};

export const coachClientTypeOptions: SelectCardOption[] = [
  {
    value: "beginners",
    label: "Beginners",
    description: "Starting from scratch",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Some experience",
  },
  {
    value: "advanced_athletes",
    label: "Advanced Athletes",
    description: "Competitive level",
  },
  {
    value: "seniors_50_plus",
    label: "Seniors 50+",
    description: "Age-specific programs",
  },
  {
    value: "postpartum",
    label: "Postpartum",
    description: "Post-pregnancy fitness",
  },
  {
    value: "corporate",
    label: "Corporate",
    description: "Busy professionals",
  },
];

export const coachClientTypeLabelMap: Record<string, string> = {
  beginners: "Beginners",
  intermediate: "Intermediate",
  advanced_athletes: "Advanced Athletes",
  seniors_50_plus: "Seniors 50+",
  postpartum: "Postpartum",
  corporate: "Corporate",
};

export const coachSessionFormatOptions: SelectCardOption[] = [
  {
    value: "in_person",
    label: "In-Person Sessions",
  },
  {
    value: "virtual_online",
    label: "Virtual / Online",
  },
  {
    value: "hybrid",
    label: "Hybrid (Both)",
  },
  {
    value: "async_programs",
    label: "Async Programs",
  },
];

export const coachSessionFormatLabelMap: Record<string, string> = {
  in_person: "In-Person Sessions",
  virtual_online: "Virtual / Online",
  hybrid: "Hybrid (Both)",
  async_programs: "Async Programs",
};

export const coachAvailabilityOptions: SelectCardOption[] = [
  {
    value: "mornings",
    label: "Mornings",
    description: "6am – 12pm",
  },
  {
    value: "afternoons",
    label: "Afternoons",
    description: "12pm – 5pm",
  },
  {
    value: "evenings",
    label: "Evenings",
    description: "5pm – 9pm",
  },
  {
    value: "weekends",
    label: "Weekends",
    description: "Sat & Sun",
  },
];

export const coachAvailabilityLabelMap: Record<string, string> = {
  mornings: "Mornings",
  afternoons: "Afternoons",
  evenings: "Evenings",
  weekends: "Weekends",
};

// These defaults make the page state initialization easy to read and keep the
// empty form shape in one place.
export const coachInitialCredentials: CoachCredentialsValues = {
  certifications: "",
  yearsExperience: "",
  bio: "",
};

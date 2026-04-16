import type { SelectCardOption } from "../Interfaces/OnboardingSurvey/selectCard";
import type {
  CoachCredentialsValues,
  CoachDayOfWeek,
} from "../Interfaces/OnboardingSurvey/coach";

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
    subtitle:
      "Select your client types, session format, and weekly availability",
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

export const coachDaysOfWeek: CoachDayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const coachDayLabelMap: Record<CoachDayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const coachInitialCredentials: CoachCredentialsValues = {
  certificationCount: 0,
  certifications: [],
  yearsExperience: "",
  bio: "",
};

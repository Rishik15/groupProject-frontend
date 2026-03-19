import type { SelectCardOption } from "../../components/OnboardingSurvey/SelectCardGroup";

// Goal options power the reusable SelectCardGroup UI on the client goals step.
// Keeping labels and descriptions here keeps the TSX step component focused on layout.
export const clientGoalOptions: SelectCardOption[] = [
  {
    value: "lose_weight",
    label: "Lose Weight",
    description: "Fat loss and body composition",
  },
  {
    value: "build_muscle",
    label: "Build Muscle",
    description: "Strength and hypertrophy",
  },
  {
    value: "improve_endurance",
    label: "Improve Endurance",
    description: "Cardio and stamina",
  },
  {
    value: "flexibility",
    label: "Flexibility",
    description: "Mobility and stretching",
  },
  {
    value: "general_fitness",
    label: "General Fitness",
    description: "Overall health and wellness",
  },
  {
    value: "sport_specific",
    label: "Sport-Specific",
    description: "Training for athletic performance",
  },
];

// Summary screens and any future API payload formatting can use this map to turn
// stored option values back into human-readable labels without hardcoding strings in TSX.
export const clientGoalLabelMap: Record<string, string> = {
  lose_weight: "Lose Weight",
  build_muscle: "Build Muscle",
  improve_endurance: "Improve Endurance",
  flexibility: "Flexibility",
  general_fitness: "General Fitness",
  sport_specific: "Sport-Specific",
};

// Centralize page copy for each step so the page component only has to look up the
// current title and subtitle instead of keeping display text inline.
// An array keeps step access simple with currentStep - 1 and avoids object key casts.
export const clientSteps = [
  {
    title: "What are your goals?",
    subtitle: "Select all that apply to you",
  },
  {
    title: "Tell us about yourself",
    subtitle: "This helps personalize your experience",
  },
  {
    title: "You're all set!",
    subtitle: "Review your profile before continuing",
  },
] as const;

export const clientTotalSteps = clientSteps.length;

// Shared shape for the personal details collected during onboarding.
export interface ClientInfoValues {
  age: string;
  height: string;
  weight: string;
}

// Fitness level options are kept with the rest of the client survey config so the
// step component can stay mostly structural and not own content data.
export const clientFitnessOptions = [
  {
    value: "beginner",
    label: "Beginner",
    description: "Just starting out",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Active 1–3 years",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Consistent 3+ years",
  },
] as const;

// Export the union type from the options array so all client onboarding files
// share one source of truth for allowed fitness level values.
export type ClientFitnessLevel =
  (typeof clientFitnessOptions)[number]["value"];

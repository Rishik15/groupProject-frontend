import type { SelectCardOption } from "../../components/OnboardingSurvey/SelectCardGroup";

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

/**
 * Central step copy for the client flow.
 * Keeping this outside the page component prevents the page from turning into
 * a long mix of UI copy and state logic.
 */
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

/**
 * Numeric fields stay as strings in component state.
 * This keeps the inputs easy to edit until the final backend payload is built.
 */
export interface ClientInfoValues {
  height: string;
  weight: string;
  goalWeight: string;
  dateOfBirth: string;
}

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

export type ClientFitnessLevel = (typeof clientFitnessOptions)[number]["value"];

// Goal values are what we store in state. This map turns them back into labels.
export const clientGoalLabelMap: Record<string, string> = {
  lose_weight: "Lose Weight",
  build_muscle: "Build Muscle",
  improve_endurance: "Improve Endurance",
  flexibility: "Flexibility",
  general_fitness: "General Fitness",
  sport_specific: "Sport-Specific",
};

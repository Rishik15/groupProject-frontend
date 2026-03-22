import type { SelectCardOption } from "../Interfaces/OnboardingSurvey/selectCard";
import type { ClientFitnessLevel } from "../Interfaces/OnboardingSurvey/client";

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

export const clientFitnessOptions: Array<{
  value: ClientFitnessLevel;
  label: string;
  description: string;
}> = [
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
];

export const clientGoalLabelMap: Record<string, string> = {
  lose_weight: "Lose Weight",
  build_muscle: "Build Muscle",
  improve_endurance: "Improve Endurance",
  flexibility: "Flexibility",
  general_fitness: "General Fitness",
  sport_specific: "Sport-Specific",
};

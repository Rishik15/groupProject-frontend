import { Dumbbell, Scale, Heart, Zap } from "lucide-react";
import type { ExerciseGoal } from "./types";

export const exerciseGoals: ExerciseGoal[] = [
  {
    title: "Muscle Gain",
    description: "Build muscle mass and increase size",
    icon: Dumbbell,
    iconBg: "bg-blue-500 text-blue-100",
    category: "Muscle Gain",
  },
  {
    title: "Weight Loss",
    description: "Burn fat and lose weight",
    icon: Scale,
    iconBg: "bg-yellow-500 text-yellow-100",
    category: "Weight Loss",
  },
  {
    title: "Endurance",
    description: "Build cardiovascular and muscular endurance",
    icon: Heart,
    iconBg: "bg-red-500 text-red-100",
    category: "Endurance",
  },
  {
    title: "Strength",
    description: "Increase muscle size and power",
    icon: Zap,
    iconBg: "bg-purple-500 text-purple-100",
    category: "Strength",
  },
];
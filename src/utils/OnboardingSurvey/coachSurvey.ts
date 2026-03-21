import type { SelectCardOption } from "../../components/OnboardingSurvey/SelectCardGroup";

export interface CoachCertificationValues {
  cert_name: string;
  provider_name: string;
  description: string;
  issued_date: string;
  expires_date: string;
}

/**
 * Shared shape for the coach credentials step.
 * This is reused by the page, step components, and payload builder.
 */
export interface CoachCredentialsValues {
  certificationCount: number;
  certifications: CoachCertificationValues[];
  yearsExperience: string;
  bio: string;
}

export type CoachDayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface CoachAvailabilityBlock {
  id: string;
  dayOfWeek: CoachDayOfWeek;
  startTime: string;
  endTime: string;
  recurring: true;
  active: true;
}

export const createEmptyCoachCertification = (): CoachCertificationValues => ({
  cert_name: "",
  provider_name: "",
  description: "",
  issued_date: "",
  expires_date: "",
});

// Step copy lives here so the page file can focus on flow logic.
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
    subtitle: "Select your client types, session format, and weekly availability",
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

// These options drive the reusable selection card component.
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

// Label maps are mostly used by summary screens and profile-description text.
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

let availabilityBlockCounter = 0;

export const createEmptyAvailabilityBlock = (
  dayOfWeek: CoachDayOfWeek
): CoachAvailabilityBlock => {
  availabilityBlockCounter += 1;

  return {
    id: `${dayOfWeek}-${availabilityBlockCounter}`,
    dayOfWeek,
    startTime: "09:00",
    endTime: "10:00",
    recurring: true,
    active: true,
  };
};

export const timeStringToMinutes = (value: string) => {
  const [hours = "0", minutes = "0"] = value.split(":");

  return Number(hours) * 60 + Number(minutes);
};

export const isAvailabilityBlockValid = (
  block: Pick<CoachAvailabilityBlock, "startTime" | "endTime">
) => timeStringToMinutes(block.endTime) > timeStringToMinutes(block.startTime);

export const getOverlappingAvailabilityBlockIds = (
  blocks: CoachAvailabilityBlock[]
) => {
  const overlappingIds = new Set<string>();

  for (const day of coachDaysOfWeek) {
    const validDayBlocks = blocks
      .filter((block) => block.dayOfWeek === day)
      .filter(isAvailabilityBlockValid)
      .sort(
        (left, right) =>
          timeStringToMinutes(left.startTime) - timeStringToMinutes(right.startTime)
      );

    for (let index = 0; index < validDayBlocks.length - 1; index += 1) {
      const currentBlock = validDayBlocks[index];
      const nextBlock = validDayBlocks[index + 1];

      if (
        timeStringToMinutes(currentBlock.endTime) >
        timeStringToMinutes(nextBlock.startTime)
      ) {
        overlappingIds.add(currentBlock.id);
        overlappingIds.add(nextBlock.id);
      }
    }
  }

  return Array.from(overlappingIds);
};

export const hasOverlappingAvailabilityBlocks = (
  blocks: CoachAvailabilityBlock[]
) => getOverlappingAvailabilityBlockIds(blocks).length > 0;

export const formatAvailabilityTime = (value: string) => {
  const [hoursString = "0", minutesString = "00"] = value.split(":");
  const hours = Number(hoursString);
  const minutes = Number(minutesString);
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${normalizedHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

export const formatAvailabilityRange = (block: CoachAvailabilityBlock) =>
  `${formatAvailabilityTime(block.startTime)} - ${formatAvailabilityTime(block.endTime)}`;

// Central empty state for the credentials portion of the coach form.
export const coachInitialCredentials: CoachCredentialsValues = {
  certificationCount: 0,
  certifications: [],
  yearsExperience: "",
  bio: "",
};

const formatCoachSelectionList = (
  values: string[],
  labelMap: Record<string, string>
) => {
  if (values.length === 0) {
    return "None selected";
  }

  return values.map((value) => labelMap[value] ?? value).join(", ");
};

interface BuildCoachProfileDescriptionParams {
  primarySpecialties: string[];
  secondarySpecialties: string[];
  clientTypes: string[];
  sessionFormats: string[];
  yearsExperience: string;
  bio: string;
}

/**
 * Builds the coach description preview shown in the UI and sent to the backend.
 * Keeping the string formatting here avoids repeating it in page components.
 */
export const buildCoachProfileDescription = ({
  primarySpecialties,
  secondarySpecialties,
  clientTypes,
  sessionFormats,
  yearsExperience,
  bio,
}: BuildCoachProfileDescriptionParams) => {
  const trimmedBio = bio.trim();
  const trimmedYearsExperience = yearsExperience.trim();

  return [
    `Primary Specialties: ${formatCoachSelectionList(primarySpecialties, coachSpecialtyLabelMap)}`,
    `Secondary Specialties: ${formatCoachSelectionList(secondarySpecialties, coachSpecialtyLabelMap)}`,
    `Who You Coach: ${formatCoachSelectionList(clientTypes, coachClientTypeLabelMap)}`,
    `Session Format: ${formatCoachSelectionList(sessionFormats, coachSessionFormatLabelMap)}`,
    `Years of Coaching Experience: ${trimmedYearsExperience || "Not provided"}`,
    `Coaching Bio: ${trimmedBio || "Not provided"}`,
  ].join("\n");
};

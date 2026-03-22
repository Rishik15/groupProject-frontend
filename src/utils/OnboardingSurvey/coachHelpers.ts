import type {
  CoachAvailabilityBlock,
  CoachCertificationValues,
  CoachDayOfWeek,
} from "../Interfaces/OnboardingSurvey/coach";
import {
  coachClientTypeLabelMap,
  coachDaysOfWeek,
  coachSessionFormatLabelMap,
  coachSpecialtyLabelMap,
} from "./coachConfig";

export const createEmptyCoachCertification = (): CoachCertificationValues => ({
  cert_name: "",
  provider_name: "",
  description: "",
  issued_date: "",
  expires_date: "",
});

let availabilityBlockCounter = 0;

export const createEmptyAvailabilityBlock = (
  dayOfWeek: CoachDayOfWeek,
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
  block: Pick<CoachAvailabilityBlock, "startTime" | "endTime">,
) => timeStringToMinutes(block.endTime) > timeStringToMinutes(block.startTime);

export const getOverlappingAvailabilityBlockIds = (
  blocks: CoachAvailabilityBlock[],
) => {
  const overlappingIds = new Set<string>();

  for (const day of coachDaysOfWeek) {
    const validDayBlocks = blocks
      .filter((block) => block.dayOfWeek === day)
      .filter(isAvailabilityBlockValid)
      .sort(
        (left, right) =>
          timeStringToMinutes(left.startTime) -
          timeStringToMinutes(right.startTime),
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
  blocks: CoachAvailabilityBlock[],
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

const formatCoachSelectionList = (
  values: string[],
  labelMap: Record<string, string>,
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

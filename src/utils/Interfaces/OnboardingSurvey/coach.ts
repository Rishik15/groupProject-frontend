export interface CoachCertificationValues {
  cert_name: string;
  provider_name: string;
  description: string;
  issued_date: string;
  expires_date: string;
}

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

export interface ClientInfoValues {
  height: string;
  weight: string;
  goalWeight: string;
  dateOfBirth: string;
  profilePicture: string;
}

export type ClientFitnessLevel =
  | "beginner"
  | "intermediate"
  | "advanced";
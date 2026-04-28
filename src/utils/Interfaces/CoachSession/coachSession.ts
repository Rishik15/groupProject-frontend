export interface CoachSessionClient {
  contractId: number;
  userId?: number | null;
  firstName: string;
  lastName: string;
  name: string;
  email?: string | null;
}

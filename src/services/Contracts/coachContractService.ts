import api from "../api";
import type { CoachContractActionResponse } from "../../utils/Interfaces/Contracts/coachContracts";

export async function acceptCoachContract(
  contractId: number,
): Promise<CoachContractActionResponse> {
  try {
    const response = await api.patch("/contract/coachAcceptContract", {
      contract_id: contractId,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to accept coach contract",
    );
  }
}

export async function rejectCoachContract(
  contractId: number,
): Promise<CoachContractActionResponse> {
  try {
    const response = await api.patch("/contract/coachRejectContract", {
      contract_id: contractId,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to reject coach contract",
    );
  }
}

export async function terminateCoachContract(
  contractId: number,
): Promise<CoachContractActionResponse> {
  try {
    const response = await api.patch("/contract/coachTerminateContract", {
      contract_id: contractId,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to terminate coach contract",
    );
  }
}

import axios from "axios";
import type { CoachContractActionResponse } from "../../utils/Interfaces/Contracts/coachContracts";

export async function acceptCoachContract(
  contractId: number,
): Promise<CoachContractActionResponse> {
  try {
    const response = await axios.patch(
      "http://localhost:8080/contract/coachAcceptContract",
      {
        contract_id: contractId,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

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
    const response = await axios.patch(
      "http://localhost:8080/contract/coachRejectContract",
      {
        contract_id: contractId,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

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
    const response = await axios.patch(
      "http://localhost:8080/contract/coachTerminateContract",
      {
        contract_id: contractId,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to terminate coach contract",
    );
  }
}

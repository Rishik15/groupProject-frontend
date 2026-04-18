import axios from "axios";
import type {
    CoachContract,
    CoachContractActionResponse,
} from "../../utils/Interfaces/Contracts/coachContracts";

export async function getAllCoachContracts(): Promise<CoachContract[]> {
    try {
        const response = await axios.get(
            "http://localhost:8080/contract/getAllCoachSideContracts",
            {
                withCredentials: true,
            },
        );

        return response.data?.Response || [];
    } catch (error: any) {
        throw new Error(
            error.response?.data?.error || "Failed to fetch coach contracts",
        );
    }
}

export async function getCoachActiveContracts(): Promise<CoachContract[]> {
    try {
        const response = await axios.get(
            "http://localhost:8080/contract/getCoachActiveContracts",
            {
                withCredentials: true,
            },
        );

        return response.data?.Response || [];
    } catch (error: any) {
        throw new Error(
            error.response?.data?.error || "Failed to fetch active coach contracts",
        );
    }
}

export async function getCoachInactiveContracts(): Promise<CoachContract[]> {
    try {
        const response = await axios.get(
            "http://localhost:8080/contract/getCoachInactiveContracts",
            {
                withCredentials: true,
            },
        );

        return response.data?.Response || [];
    } catch (error: any) {
        throw new Error(
            error.response?.data?.error || "Failed to fetch inactive coach contracts",
        );
    }
}

export async function acceptCoachContract(
    contractId: number,
    active = 0,
): Promise<CoachContractActionResponse> {
    try {
        const response = await axios.patch(
            "http://localhost:8080/contract/coachAcceptContract",
            {
                contract_id: contractId,
                active,
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
    active = 0,
): Promise<CoachContractActionResponse> {
    try {
        const response = await axios.patch(
            "http://localhost:8080/contract/coachRejectContract",
            {
                contract_id: contractId,
                active,
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
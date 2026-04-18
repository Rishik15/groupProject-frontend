export interface CoachContract {
    contract_id: number;
    user_id: number;
    active: number;
    agreed_price: number | string;
    contract_text: string | null;
    first_name?: string | null;
    last_name?: string | null;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
    updated_at?: string;
}

export type CoachContractTabKey = "pending" | "active" | "history";

export interface CoachContractsResponse {
    Response: CoachContract[];
}

export interface CoachContractActionResponse {
    message?: string;
    error?: string;
}
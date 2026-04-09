import type { CoachContract } from "../Interfaces/Contracts/coachContracts";

export const CONTRACT_TEXT_COLOR = "#0F0F14";
export const CONTRACT_MUTED_COLOR = "#72728A";
export const CONTRACT_PRIMARY_COLOR = "#5E5EF4";

export const formatCurrency = (value: number | string) => {
    const numericValue =
        typeof value === "number" ? value : Number.parseFloat(value || "0");

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(Number.isNaN(numericValue) ? 0 : numericValue);
};

export const formatDisplayDate = (dateString?: string | null) => {
    if (!dateString) return "—";

    const parsedDate = new Date(dateString);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-CA");
};

export const getClientFullName = (contract: CoachContract) => {
    const firstName = contract.first_name?.trim() || "";
    const lastName = contract.last_name?.trim() || "";

    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || "Client";
};

export const getInitials = (contract: CoachContract) => {
    const first = contract.first_name?.[0] ?? "";
    const last = contract.last_name?.[0] ?? "";
    const initials = `${first}${last}`.toUpperCase();

    return initials || "CL";
};

export const getContractDurationLabel = (startDate?: string | null, endDate?: string | null) => {
    if (!startDate && !endDate) return "Duration not set";
    if (startDate && !endDate) return `Started ${formatDisplayDate(startDate)}`;
    if (!startDate && endDate) return `Ended ${formatDisplayDate(endDate)}`;

    return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
};

export const isPendingContract = (contract: CoachContract) =>
    contract.active === 0 && !contract.end_date;

export const isActiveContract = (contract: CoachContract) =>
    contract.active === 1;

export const isHistoricalContract = (contract: CoachContract) =>
    contract.active === 0 && Boolean(contract.end_date);

export const splitContractsByStatus = (contracts: CoachContract[]) => {
    const pending = contracts.filter(isPendingContract);
    const active = contracts.filter(isActiveContract);
    const history = contracts.filter(isHistoricalContract);

    return {
        pending,
        active,
        history,
    };
};
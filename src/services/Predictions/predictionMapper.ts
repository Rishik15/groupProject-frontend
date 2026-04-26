import type { AdminPrediction } from "../../utils/Interfaces/Predictions/adminPrediction";
import type {
    PredictionBet,
    PredictionBetResult,
} from "../../utils/Interfaces/Predictions/predictionBet";
import type { PredictionLeaderboardEntry } from "../../utils/Interfaces/Predictions/predictionLeaderboard";
import type {
    PredictionCancelRequestStatus,
    PredictionMarket,
    PredictionMarketStatus,
    PredictionReviewStatus,
    PredictionSettlementResult,
} from "../../utils/Interfaces/Predictions/predictionMarket";
import type { PredictionSummary } from "../../utils/Interfaces/Predictions/predictionSummary";
import type { PredictionWallet } from "../../utils/Interfaces/Predictions/predictionWallet";
import type { PredictionWalletTransaction } from "../../utils/Interfaces/Predictions/predictionWalletTransaction";

type UnknownRecord = Record<string, unknown>;

const REVIEW_STATUSES = new Set<PredictionReviewStatus>([
    "approved",
    "pending",
    "rejected",
]);

const MARKET_STATUSES = new Set<PredictionMarketStatus>([
    "open",
    "closed",
    "settled",
    "cancelled",
]);

const CANCEL_REQUEST_STATUSES = new Set<PredictionCancelRequestStatus>([
    "none",
    "pending",
    "approved",
    "rejected",
]);

const BET_VALUES = new Set(["yes", "no"] as const);

const SETTLEMENT_RESULTS = new Set<
    Exclude<PredictionSettlementResult, null>
>(["yes", "no", "cancelled"]);

const BET_RESULTS = new Set<Exclude<PredictionBetResult, null>>([
    "won",
    "lost",
    "refunded",
    "pending",
]);

const asRecord = (value: unknown): UnknownRecord =>
    value && typeof value === "object" ? (value as UnknownRecord) : {};

const asString = (value: unknown): string | undefined =>
    typeof value === "string" && value.trim().length > 0 ? value : undefined;

const asNullableString = (value: unknown): string | null =>
    asString(value) ?? null;

const asNumber = (value: unknown): number | undefined => {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }

    return undefined;
};

const asNullableNumber = (value: unknown): number | null =>
    asNumber(value) ?? null;

const asEnum = <T extends string>(
    value: unknown,
    validValues: Set<T>,
): T | undefined => {
    if (typeof value === "string" && validValues.has(value as T)) {
        return value as T;
    }

    return undefined;
};

export const normalizeReviewStatus = (
    value: unknown,
): PredictionReviewStatus => asEnum(value, REVIEW_STATUSES) ?? "pending";

export const normalizeMarketStatus = (
    value: unknown,
): PredictionMarketStatus => asEnum(value, MARKET_STATUSES) ?? "open";

export const normalizeCancelRequestStatus = (
    value: unknown,
): PredictionCancelRequestStatus =>
    asEnum(value, CANCEL_REQUEST_STATUSES) ?? "none";

export const normalizePredictionValue = (value: unknown): "yes" | "no" =>
    asEnum(value, BET_VALUES as Set<"yes" | "no">) ?? "yes";

export const normalizeSettlementResult = (
    value: unknown,
): PredictionSettlementResult => asEnum(value, SETTLEMENT_RESULTS) ?? null;

export const normalizeBetResult = (value: unknown): PredictionBetResult =>
    asEnum(value, BET_RESULTS) ?? null;

export const mapPredictionMarket = (raw: unknown): PredictionMarket => {
    const record = asRecord(raw);

    return {
        market_id: asNumber(record.market_id) ?? 0,
        creator_user_id: asNumber(record.creator_user_id) ?? 0,
        creator_name: asString(record.creator_name) ?? "",
        creator_email: asString(record.creator_email) ?? "",
        title: asString(record.title) ?? "",
        goal_text: asString(record.goal_text) ?? "",
        end_date: asString(record.end_date) ?? "",
        status: normalizeMarketStatus(record.status),
        review_status: normalizeReviewStatus(record.review_status),
        reviewed_by_admin_id: asNullableNumber(record.reviewed_by_admin_id),
        reviewed_at: asNullableString(record.reviewed_at),
        review_note: asNullableString(record.review_note),
        settlement_result: normalizeSettlementResult(record.settlement_result),
        settled_by_admin_id: asNullableNumber(record.settled_by_admin_id),
        settled_at: asNullableString(record.settled_at),
        settlement_note: asNullableString(record.settlement_note),
        cancel_request_status: normalizeCancelRequestStatus(
            record.cancel_request_status,
        ),
        cancel_request_reason: asNullableString(record.cancel_request_reason),
        cancel_requested_at: asNullableString(record.cancel_requested_at),
        cancel_reviewed_by_admin_id: asNullableNumber(
            record.cancel_reviewed_by_admin_id,
        ),
        cancel_reviewed_at: asNullableString(record.cancel_reviewed_at),
        cancel_review_note: asNullableString(record.cancel_review_note),
        result: normalizeSettlementResult(record.result),
        total_bets: asNumber(record.total_bets) ?? 0,
        total_points: asNumber(record.total_points) ?? 0,
        yes_bets: asNumber(record.yes_bets) ?? 0,
        no_bets: asNumber(record.no_bets) ?? 0,
        yes_points: asNumber(record.yes_points) ?? 0,
        no_points: asNumber(record.no_points) ?? 0,
        created_at: asNullableString(record.created_at),
        updated_at: asNullableString(record.updated_at),
    };
};

export const mapPredictionMarkets = (raw: unknown): PredictionMarket[] =>
    Array.isArray(raw) ? raw.map(mapPredictionMarket) : [];

export const mapPredictionBet = (raw: unknown): PredictionBet => {
    const record = asRecord(raw);

    return {
        prediction_id: asNumber(record.prediction_id) ?? 0,
        market_id: asNumber(record.market_id) ?? 0,
        predictor_user_id: asNumber(record.predictor_user_id) ?? 0,
        prediction_value: normalizePredictionValue(record.prediction_value),
        points_wagered: asNumber(record.points_wagered) ?? 0,
        market_title: asNullableString(record.market_title),
        goal_text: asNullableString(record.goal_text),
        end_date: asNullableString(record.end_date),
        market_status: asNullableString(record.market_status),
        created_at: asNullableString(record.created_at),
        updated_at: asNullableString(record.updated_at),
        projected_payout: asNumber(record.projected_payout),
        final_payout: asNumber(record.final_payout),
        result: normalizeBetResult(record.result),
    };
};

export const mapPredictionBets = (raw: unknown): PredictionBet[] =>
    Array.isArray(raw) ? raw.map(mapPredictionBet) : [];

export const mapPredictionSummary = (raw: unknown): PredictionSummary => {
    const record = asRecord(raw);

    return {
        wallet_balance: asNumber(record.wallet_balance) ?? 0,
        total_bets_placed: asNumber(record.total_bets_placed) ?? 0,
        total_markets_created: asNumber(record.total_markets_created) ?? 0,
        open_markets_created: asNumber(record.open_markets_created) ?? 0,
        completed_markets_participated:
            asNumber(record.completed_markets_participated) ?? 0,
    };
};

export const mapPredictionWallet = (raw: unknown): PredictionWallet => {
    const record = asRecord(raw);

    return {
        user_id: asNumber(record.user_id) ?? 0,
        balance: asNumber(record.balance) ?? 0,
        created_at: asNullableString(record.created_at),
        updated_at: asNullableString(record.updated_at),
    };
};

export const mapPredictionWalletTransaction = (
    raw: unknown,
): PredictionWalletTransaction => {
    const record = asRecord(raw);

    return {
        txn_id: asNumber(record.txn_id) ?? 0,
        user_id: asNumber(record.user_id),
        delta_points: asNumber(record.delta_points) ?? 0,
        reason: asString(record.reason) ?? "",
        ref_type: asString(record.ref_type) ?? null,
        ref_id: asNumber(record.ref_id) ?? null,
        created_at: asNullableString(record.created_at),
        updated_at: asNullableString(record.updated_at),
    };
};

export const mapPredictionWalletTransactions = (
    raw: unknown,
): PredictionWalletTransaction[] =>
    Array.isArray(raw) ? raw.map(mapPredictionWalletTransaction) : [];

export const mapPredictionLeaderboardEntry = (
    raw: unknown,
): PredictionLeaderboardEntry => {
    const record = asRecord(raw);

    return {
        user_id: asNumber(record.user_id) ?? 0,
        name: asString(record.name) ?? "",
        balance: asNumber(record.balance) ?? 0,
        rank: asNumber(record.rank),
    };
};

export const mapPredictionLeaderboard = (
    raw: unknown,
): PredictionLeaderboardEntry[] =>
    Array.isArray(raw) ? raw.map(mapPredictionLeaderboardEntry) : [];

export const mapAdminPrediction = (raw: unknown): AdminPrediction => {
    const record = asRecord(raw);

    return {
        market_id: asNumber(record.market_id) ?? 0,
        creator_name: asString(record.creator_name) ?? "",
        creator_email: asNullableString(record.creator_email),
        title: asString(record.title) ?? "",
        goal_text: asString(record.goal_text) ?? "",
        end_date: asString(record.end_date) ?? "",
        status: normalizeMarketStatus(record.status),
        review_status: normalizeReviewStatus(record.review_status),
        cancel_request_status: normalizeCancelRequestStatus(
            record.cancel_request_status,
        ),
        settlement_result: normalizeSettlementResult(
            record.settlement_result ?? record.result,
        ),
        total_bets: asNumber(record.total_bets) ?? 0,
        total_points: asNumber(record.total_points) ?? 0,
        review_note: asNullableString(record.review_note),
        settlement_note: asNullableString(record.settlement_note),
        cancel_request_reason: asNullableString(
            record.cancel_request_reason ?? record.cancel_reason,
        ),
        cancel_review_note: asNullableString(record.cancel_review_note),
        created_at: asNullableString(record.created_at),
        updated_at: asNullableString(record.updated_at),
    };
};

export const mapAdminPredictions = (raw: unknown): AdminPrediction[] =>
    Array.isArray(raw) ? raw.map(mapAdminPrediction) : [];
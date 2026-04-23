import type {
  CreatePredictionMarketPayload,
  PlacePredictionBetPayload,
} from "../Interfaces/Predictions";

export interface PredictionValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

const normalizeDate = (value: string): Date => new Date(`${value}T00:00:00`);

export const isValidFutureDate = (date: string, now = new Date()): boolean => {
  const deadline = normalizeDate(date);
  if (Number.isNaN(deadline.getTime())) return false;
  const floor = new Date(now);
  floor.setHours(0, 0, 0, 0);
  return deadline.getTime() > floor.getTime();
};

export const validateCreateMarketForm = (
  values: Partial<CreatePredictionMarketPayload>,
  now = new Date(),
): PredictionValidationResult => {
  const errors: Record<string, string> = {};

  if (!values.title?.trim()) errors.title = "Title is required.";
  if (!values.goal_text?.trim()) errors.goal_text = "Goal text is required.";
  if (!values.end_date?.trim()) {
    errors.end_date = "Deadline is required.";
  } else if (!isValidFutureDate(values.end_date, now)) {
    errors.end_date = "Deadline must be a future date.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validatePredictionSide = (value?: string | null): boolean => value === "yes" || value === "no";

export const validateBetAmount = (
  amount: number | null | undefined,
  walletBalance: number,
  minBet = 1,
): PredictionValidationResult => {
  const errors: Record<string, string> = {};

  if (amount == null || Number.isNaN(amount)) {
    errors.points_wagered = "Bet amount is required.";
  } else if (!Number.isInteger(amount) || amount <= 0) {
    errors.points_wagered = "Bet amount must be a positive whole number.";
  } else if (amount < minBet) {
    errors.points_wagered = `Minimum bet is ${minBet} point${minBet === 1 ? "" : "s"}.`;
  } else if (amount > walletBalance) {
    errors.points_wagered = "Bet amount cannot exceed wallet balance.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validatePlacePrediction = (
  values: Partial<PlacePredictionBetPayload>,
  walletBalance: number,
  minBet = 1,
): PredictionValidationResult => {
  const errors: Record<string, string> = {};

  if (!validatePredictionSide(values.prediction_value)) {
    errors.prediction_value = "Choose either yes or no.";
  }

  const amountResult = validateBetAmount(values.points_wagered, walletBalance, minBet);
  Object.assign(errors, amountResult.errors);

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateCancelReason = (value?: string | null): PredictionValidationResult => {
  const errors: Record<string, string> = {};
  if (!value?.trim()) {
    errors.reason = "Cancellation reason is required.";
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

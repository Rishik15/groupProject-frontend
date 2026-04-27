export type PaymentMethod = {
  payment_method_id: number;
  user_id: number;
  card_last_four: string;
  card_brand: string;
  expiry_month: number;
  expiry_year: number;
  is_default: number;
};

export type PaymentMethodForm = {
  cardNumber: string;
  expiry: string;
  cvc: string;
  name: string;
  isDefault: boolean;
};

export type AddPaymentMethodPayload = {
  card_number: string;
  card_brand: string;
  expiry_month: number;
  expiry_year: number;
};

export type PaymentHistoryDetail = {
  payment_id: number;

  amount: number;
  currency: string;
  description: string | null;
  paid_at: string | null;

  payment_type: "subscription" | "coaching_fee" | "one_time";
  status: "pending" | "completed" | "failed";

  coach: {
    coach_id: number;
    first_name: string;
    last_name: string;
  } | null;

  payment_method: {
    card_brand: string;
    card_last_four: string;
    expiry_month: number;
    expiry_year: number;
  } | null;
};

export type Contract = {
  contract_id: number;
  coach_id: number;
  agreed_price: number;
  coach_name: string;
};
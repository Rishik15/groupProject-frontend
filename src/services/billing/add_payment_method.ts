import axios from "axios";
import type { AddPaymentMethodPayload } from "../../components/Billing/type";
import { BASE_URL, DIRECTORY } from "./constants";

export const add_payment_method = async (card: AddPaymentMethodPayload) => {
  const res = await axios.post(BASE_URL + DIRECTORY + "/add-card", card, {
    withCredentials: true,
  });

  return res.data;
};

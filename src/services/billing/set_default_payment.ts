import axios from "axios";

export const set_default_payment = (payment_method_id: number) => {
    return axios.put(
        "http://localhost:8080/payments/payment-methods/set-default",
        { payment_method_id },
        { withCredentials: true }
    );
};
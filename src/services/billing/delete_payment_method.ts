import axios from "axios";

export const delete_payment_method = (payment_method_id: number) => {
    return axios.delete(
        "http://localhost:8080/payments/payment-methods/delete",
        {
            data: { payment_method_id },
            withCredentials: true,
        }
    );
};
import axios from "axios";
import { BASE_URL, DIRECTORY } from "./constants";

export const get_PaymentHistory = async () => {
    const res = await axios.get(
        BASE_URL + DIRECTORY + "/history",
        {
            withCredentials: true,
        }
    );

    return res;
};
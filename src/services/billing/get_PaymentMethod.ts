import axios from "axios"
import { BASE_URL, DIRECTORY } from "./constants"

export const get_PaymentMethods = async () => {

    const res = await axios.get(BASE_URL + DIRECTORY + "/payment-methods",
        { withCredentials: true }
    )

    return res;

}
import axios from "axios";
import type { Filters } from "./types";



const get_plans = async (filters: Filters) => {
    const res = await axios.post(
        "http://localhost:8080/workouts/predefined",
        filters,
        { withCredentials: true }
    );

    return res.data;
};

export default get_plans;
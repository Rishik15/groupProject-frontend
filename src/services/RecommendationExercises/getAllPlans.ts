import axios from "axios";
const get_all_plans = async () => {
    const res = await axios.post(
        "http://localhost:8080/workouts/predefined",
        {},
        { withCredentials: true }
    );

    return res;
}
export default get_all_plans;
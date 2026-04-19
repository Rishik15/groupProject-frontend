import axios from "axios";

export const getNutrition = async () => {
  const res = await axios.get(
    "http://localhost:8080/dashboard/client/nutrition",
    {
      withCredentials: true, 
    },
  );

  return res.data;
};

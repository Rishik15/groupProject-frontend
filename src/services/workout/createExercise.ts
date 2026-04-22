import axios from "axios";

const BASE_URL = "http://localhost:8080";

export async function createExercise(formData: FormData): Promise<void> {
  await axios.post(
    `${BASE_URL}/coach/exercise/create`,
    formData,
    {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
}
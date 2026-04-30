import api from "../api";

export async function createExercise(formData: FormData): Promise<void> {
  if (!formData.has("mode")) {
    formData.append("mode", "coach");
  }

  await api.post("/coach/exercise/create", formData);
}

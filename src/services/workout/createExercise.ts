import api from "../api";

export async function createExercise(formData: FormData): Promise<void> {
  await api.post("/coach/exercise/create", formData);
}
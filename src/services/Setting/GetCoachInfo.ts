export const GetCoachInfo = async () => {
  try {
    const res = await fetch("http://localhost:8080/coach/profile", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch coach info: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching coach info:", error);
    throw error;
  }
};
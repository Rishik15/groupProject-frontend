export const GetCoachInfo = async () => {
  const res = await fetch("http://localhost:8080/coach/profile", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }

  return await res.json();
};
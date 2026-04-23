export const submitSurvey = async (payload: {
    mood_score: number;
    notes: string;
}) => {
    const res = await fetch("http://localhost:8080/client/mental-survey", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.message || "Failed to submit survey");
    }

    return data;
};
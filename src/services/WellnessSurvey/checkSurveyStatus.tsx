export const checkSurveyStatus = async () => {
    const res = await fetch("http://localhost:8080/client/mental-survey/check", {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch survey status");
    }

    const data = await res.json();
    return data.taken_today; 
};
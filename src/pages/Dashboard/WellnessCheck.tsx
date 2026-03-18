import React, { useState } from "react";



type WellnessData = {
    user_id: number;
    mood_score: number;
    notes: string;
};

const WellnessCheck = () => {
    const [userId, setUserId] = useState<number>(1);
    const [moodScore, setMoodScore] = useState<number>(3);
    const [notes, setNotes] = useState<string>("");

    const sendWellness = async (): Promise<void> => {
        const payload: WellnessData = {
            user_id: userId,
            mood_score: moodScore,
            notes: notes,
        };

        try {
            const res = await fetch("http://localhost:8080/client/mental-survey", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <section>
            <form onSubmit={sendWellness}>
                <div>
                    <input
                        type="number"
                        placeholder="User ID"
                        value={userId}
                        onChange={(e) => setUserId(Number(e.target.value))}
                    />
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Mood Score (1-10)"
                        value={moodScore}
                        onChange={(e) => setMoodScore(Number(e.target.value))}
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </section>
    );
};

export default WellnessCheck;